"""
Embedding ingestion script.

Reads active KnowledgeChunk rows from PostgreSQL, embeds their current text,
and stores only embeddings plus PostgreSQL identifiers/metadata in ChromaDB.

Run this after importing or editing knowledge-base content:

    python ingest.py
"""
import logging

import models
from database import SessionLocal
from services.vector_store import get_vector_store

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ifhe_chatbot.ingest")


def main():
    db = SessionLocal()
    try:
        chunks = (
            db.query(models.KnowledgeChunk)
            .join(models.KnowledgeDocument)
            .filter(
                models.KnowledgeChunk.is_active.is_(True),
                models.KnowledgeDocument.status == "published",
                models.KnowledgeDocument.is_deleted.is_(False),
            )
            .order_by(models.KnowledgeDocument.source_path, models.KnowledgeChunk.chunk_key)
            .all()
        )

        logger.info("Found %d active PostgreSQL knowledge chunks", len(chunks))
        store = get_vector_store()
        store.reset()

        ids, documents, metadatas = [], [], []
        for chunk in chunks:
            document = chunk.document
            ids.append(chunk.id)
            documents.append(chunk.text)
            metadata = dict(chunk.metadata_json or {})
            metadata.update(
                {
                    "knowledge_chunk_id": chunk.id,
                    "knowledge_document_id": document.id,
                    "source_file": document.source_path,
                    "category": document.category,
                    "content_type": document.content_type,
                }
            )
            metadatas.append({key: str(value) for key, value in metadata.items()})

        if ids:
            store.add_chunks(ids, documents, metadatas)

        logger.info("Ingestion complete. Total embeddings: %d", len(ids))
    finally:
        db.close()


if __name__ == "__main__":
    main()
