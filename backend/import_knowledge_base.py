"""
Import knowledge_base/**/*.json into PostgreSQL.

This script is safe to rerun:
  - one KnowledgeDocument is upserted per JSON file
  - KnowledgeChunk rows are upserted by stable chunk_key
  - chunks that no longer exist in the JSON source are marked inactive
  - URLs/emails/phones found in payloads are upserted as KnowledgeResource rows

Runtime chatbot behavior is not changed by this script. It prepares PostgreSQL
to become the knowledge-base source of truth in the next migration step.
"""
import hashlib
import json
import logging
import re
from datetime import datetime
from pathlib import Path
from typing import Any

import models
from database import SessionLocal
from services.json_loader import KB_ROOT, category_from_path, list_all_json_files

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")
logger = logging.getLogger("ifhe_chatbot.import_knowledge_base")

NAVIGATION_PATHS = {
    "University/About_IU_Nagaland.json": "about_ifhe",
    "University/Schools.json": "schools",
    "University/Rankings.json": "rankings",
    "Programs/Undergraduate.json": "programs.undergraduate",
    "Programs/Postgraduate.json": "programs.postgraduate",
    "Programs/Doctoral.json": "programs.doctoral",
    "Programs/Certificate.json": "programs.certificate",
    "Campus_Life/Campus_Life_Summary.json": "campus_life",
    "Placements/Placements.json": "placements",
    "Admissions/Admission_Calendar.json": "admissions.calendar",
    "Admissions/Admission_Process.json": "admissions.process",
    "Admissions/Eligibility.json": "admissions.eligibility",
    "Admissions/Scholarships.json": "admissions.scholarships",
    "Admissions/FAQs.json": "admissions.faqs",
}

URL_RE = re.compile(r"https?://[^\s)\"']+")
EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
PHONE_RE = re.compile(r"\b(?:\+?91[-\s]?)?[6-9]\d{9}\b")


def stable_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def checksum(value: Any) -> str:
    raw = value if isinstance(value, str) else stable_json(value)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def relative_source_path(path: Path) -> str:
    return path.relative_to(KB_ROOT).as_posix()


def title_from_path(path: Path) -> str:
    return path.stem.replace("_", " ")


def content_type_from_path(path: Path, data: dict[str, Any]) -> str:
    stem = path.stem.lower()
    if stem in {"faqs"}:
        return "faq"
    if stem in {"undergraduate", "postgraduate", "doctoral", "certificate"}:
        return "programs"
    if "calendar" in stem:
        return "admission_calendar"
    if "process" in stem:
        return "admission_process"
    if "eligibility" in stem:
        return "eligibility"
    if "fee" in stem:
        return "fee_details"
    if "scholarship" in stem:
        return "scholarships"
    if "placement" in stem:
        return "placements"
    if "campus" in stem:
        return "campus_life"
    if "programs" in data:
        return "programs"
    return "university_content"


def dict_or_list_to_paragraph(obj: Any) -> str:
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


def body_text_from_payload(data: dict[str, Any]) -> str:
    return "\n".join(build_chunk_texts(data))


def build_chunk_texts(obj: Any) -> list[str]:
    if isinstance(obj, dict):
        lines = []
        for key, value in obj.items():
            label = key.replace("_", " ").title()
            if isinstance(value, (dict, list)):
                lines.append(f"{label}: {dict_or_list_to_paragraph(value)}")
            else:
                lines.append(f"{label}: {value}")
        return lines
    if isinstance(obj, list):
        return [dict_or_list_to_paragraph(item) for item in obj]
    return [str(obj)]


def build_chunks_for_document(path: Path, data: dict[str, Any]) -> list[dict[str, Any]]:
    file_stem = path.stem
    category = category_from_path(path)
    chunks = []

    list_key = None
    for key, value in data.items():
        if isinstance(value, list) and value and isinstance(value[0], dict):
            list_key = key
            break

    if list_key:
        for idx, record in enumerate(data[list_key]):
            text = f"[{file_stem}] {dict_or_list_to_paragraph(record)}"
            item_name = record.get("name") or record.get("question") or record.get("id") or str(idx)
            chunks.append(
                {
                    "chunk_key": f"{list_key}:{idx}",
                    "text": text,
                    "metadata": {
                        "category": category,
                        "source_file": relative_source_path(path),
                        "item": str(item_name),
                        "list_key": list_key,
                    },
                }
            )
        return chunks

    for key, value in data.items():
        label = key.replace("_", " ").title()
        if isinstance(value, (dict, list)):
            text = f"[{file_stem}] {label}: {dict_or_list_to_paragraph(value)}"
        else:
            text = f"[{file_stem}] {label}: {value}"
        chunks.append(
            {
                "chunk_key": key,
                "text": text,
                "metadata": {
                    "category": category,
                    "source_file": relative_source_path(path),
                    "field": key,
                },
            }
        )
    return chunks


def walk_strings(value: Any) -> list[str]:
    if isinstance(value, dict):
        strings = []
        for nested in value.values():
            strings.extend(walk_strings(nested))
        return strings
    if isinstance(value, list):
        strings = []
        for item in value:
            strings.extend(walk_strings(item))
        return strings
    if isinstance(value, str):
        return [value]
    return []


def extract_resources(data: dict[str, Any]) -> list[dict[str, str]]:
    resources = {}
    for text in walk_strings(data):
        for url in URL_RE.findall(text):
            resources[("url", url)] = {"resource_type": "url", "label": url, "value": url}
        for email in EMAIL_RE.findall(text):
            resources[("email", email)] = {"resource_type": "email", "label": email, "value": email}
        for phone in PHONE_RE.findall(text):
            resources[("phone", phone)] = {"resource_type": "phone", "label": phone, "value": phone}
    return list(resources.values())


def upsert_document(db, path: Path, data: dict[str, Any]) -> models.KnowledgeDocument:
    source_path = relative_source_path(path)
    document = (
        db.query(models.KnowledgeDocument)
        .filter(models.KnowledgeDocument.source_path == source_path)
        .first()
    )

    now = datetime.utcnow()
    payload_checksum = checksum(data)
    if document is None:
        document = models.KnowledgeDocument(
            source_path=source_path,
            created_at=now,
            published_at=now,
        )
        db.add(document)

    document.title = title_from_path(path)
    document.category = category_from_path(path)
    document.content_type = content_type_from_path(path, data)
    document.navigation_path = NAVIGATION_PATHS.get(source_path)
    document.external_id = path.stem
    document.payload = data
    document.body_text = body_text_from_payload(data)
    document.checksum = payload_checksum
    document.status = "published"
    document.is_deleted = False
    document.updated_at = now
    return document


def upsert_chunks(db, document: models.KnowledgeDocument, chunks: list[dict[str, Any]]) -> None:
    existing = {chunk.chunk_key: chunk for chunk in document.chunks}
    active_keys = set()
    now = datetime.utcnow()

    for chunk_data in chunks:
        chunk_key = chunk_data["chunk_key"]
        active_keys.add(chunk_key)
        chunk = existing.get(chunk_key)
        if chunk is None:
            chunk = models.KnowledgeChunk(
                document=document,
                chunk_key=chunk_key,
                created_at=now,
            )
            db.add(chunk)
        chunk.text = chunk_data["text"]
        chunk.metadata_json = chunk_data["metadata"]
        chunk.checksum = checksum(chunk_data["text"])
        chunk.is_active = True
        chunk.updated_at = now

    for chunk_key, chunk in existing.items():
        if chunk_key not in active_keys:
            chunk.is_active = False
            chunk.updated_at = now


def upsert_resources(db, document: models.KnowledgeDocument, resources: list[dict[str, str]]) -> None:
    existing = {(resource.resource_type, resource.label): resource for resource in document.resources}
    active_keys = set()
    now = datetime.utcnow()

    for resource_data in resources:
        key = (resource_data["resource_type"], resource_data["label"])
        active_keys.add(key)
        resource = existing.get(key)
        if resource is None:
            resource = models.KnowledgeResource(
                document=document,
                resource_type=resource_data["resource_type"],
                label=resource_data["label"],
                created_at=now,
            )
            db.add(resource)
        resource.value = resource_data["value"]
        resource.metadata_json = {"source_file": document.source_path}
        resource.is_active = True
        resource.updated_at = now

    for key, resource in existing.items():
        if key not in active_keys:
            resource.is_active = False
            resource.updated_at = now


def import_file(db, path: Path) -> tuple[str, int, int]:
    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    document = upsert_document(db, path, data)
    db.flush()

    chunks = build_chunks_for_document(path, data)
    resources = extract_resources(data)
    upsert_chunks(db, document, chunks)
    upsert_resources(db, document, resources)
    return document.source_path, len(chunks), len(resources)


def main() -> None:
    files = list_all_json_files()
    logger.info("Found %d knowledge base JSON files", len(files))

    db = SessionLocal()
    try:
        total_chunks = 0
        total_resources = 0
        for path in files:
            source_path, chunk_count, resource_count = import_file(db, path)
            total_chunks += chunk_count
            total_resources += resource_count
            logger.info("%s -> %d chunks, %d resources", source_path, chunk_count, resource_count)
        db.commit()
        logger.info(
            "Knowledge base import complete: %d files, %d chunks, %d resources",
            len(files),
            total_chunks,
            total_resources,
        )
    except Exception:
        db.rollback()
        logger.exception("Knowledge base import failed; rolled back changes")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
