"""
Ingestion script: reads every JSON file under knowledge_base/, converts each
record into readable text chunks, embeds them with sentence-transformers, and
stores them in the persistent ChromaDB collection.

Run this once initially and again any time knowledge_base/*.json changes:

    python ingest.py
"""
import json
import logging

from services.json_loader import list_all_json_files, category_from_path
from services.vector_store import get_vector_store

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ifhe_chatbot.ingest")


def flatten_to_text(obj, prefix: str = "") -> list[str]:
    """
    Recursively converts a JSON structure into a list of natural-language
    text fragments suitable for embedding. Keeps each top-level record
    (e.g. one program, one FAQ entry) as a single coherent chunk where
    possible so retrieval returns complete, useful context.
    """
    lines = []
    if isinstance(obj, dict):
        for key, value in obj.items():
            label = key.replace("_", " ").title()
            if isinstance(value, (dict, list)):
                lines.extend(flatten_to_text(value, f"{prefix}{label}: "))
            else:
                lines.append(f"{prefix}{label}: {value}")
    elif isinstance(obj, list):
        for item in obj:
            if isinstance(item, (dict, list)):
                lines.append(dict_or_list_to_paragraph(item))
            else:
                lines.append(f"{prefix}{item}")
    else:
        lines.append(f"{prefix}{obj}")
    return lines


def dict_or_list_to_paragraph(obj) -> str:
    """Turns a single record (dict) into one dense paragraph = one chunk."""
    if isinstance(obj, dict):
        parts = []
        for key, value in obj.items():
            label = key.replace("_", " ").title()
            if isinstance(value, list):
                value_str = "; ".join(str(v) for v in value)
            elif isinstance(value, dict):
                value_str = "; ".join(f"{k}: {v}" for k, v in value.items())
            else:
                value_str = str(value)
            parts.append(f"{label}: {value_str}")
        return ". ".join(parts)
    if isinstance(obj, list):
        return "; ".join(str(v) for v in obj)
    return str(obj)


def build_chunks_for_file(path) -> tuple[list[str], list[str], list[dict]]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    category = category_from_path(path)
    file_stem = path.stem  # e.g. "Undergraduate"
    ids, documents, metadatas = [], [], []

    def add_chunk(text: str, sub_id: str, extra_meta: dict | None = None):
        chunk_id = f"{category}:{file_stem}:{sub_id}"
        ids.append(chunk_id)
        documents.append(text)
        meta = {"category": category, "source_file": f"{category}/{file_stem}.json"}
        if extra_meta:
            meta.update({k: str(v) for k, v in extra_meta.items()})
        metadatas.append(meta)

    # Special-case: files whose top-level value is a list of records
    # (e.g. Undergraduate.json -> {"programs": [...]})
    list_key = None
    for key, value in data.items():
        if isinstance(value, list) and value and isinstance(value[0], dict):
            list_key = key
            break

    if list_key:
        for idx, record in enumerate(data[list_key]):
            text = dict_or_list_to_paragraph(record)
            name = record.get("name") or record.get("question") or record.get("id") or str(idx)
            add_chunk(f"[{file_stem}] {text}", str(idx), {"item": name})
    else:
        # Flat JSON object (e.g. About_IFHE.json) -> one chunk per top-level field,
        # so unrelated fields (vision vs schools) don't dilute each other.
        for key, value in data.items():
            label = key.replace("_", " ").title()
            if isinstance(value, (dict, list)):
                text = f"{label}: {dict_or_list_to_paragraph(value)}"
            else:
                text = f"{label}: {value}"
            add_chunk(f"[{file_stem}] {text}", key)

    return ids, documents, metadatas


def main():
    store = get_vector_store()
    store.reset()

    all_ids, all_docs, all_metas = [], [], []
    files = list_all_json_files()
    logger.info("Found %d knowledge base JSON files", len(files))

    for path in files:
        ids, docs, metas = build_chunks_for_file(path)
        all_ids.extend(ids)
        all_docs.extend(docs)
        all_metas.extend(metas)
        logger.info("  %s -> %d chunks", path.relative_to(path.parent.parent), len(ids))

    store.add_chunks(all_ids, all_docs, all_metas)
    logger.info("Ingestion complete. Total chunks: %d", len(all_ids))


if __name__ == "__main__":
    main()
