"""
Vector store service: wraps ChromaDB + sentence-transformers.

ChromaDB stores embeddings and PostgreSQL record identifiers only. Complete
chatbot content stays in PostgreSQL and is fetched by RAG after similarity
search returns matching chunk IDs.
"""
import logging
import os
from functools import lru_cache

os.environ.setdefault("ANONYMIZED_TELEMETRY", "False")

import chromadb
from sentence_transformers import SentenceTransformer

from config import get_settings

logger = logging.getLogger("ifhe_chatbot.vector_store")
settings = get_settings()


class VectorStore:
    def __init__(self):
        self._client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        self._embedding_model = SentenceTransformer(settings.embedding_model)
        self._collection = self._client.get_or_create_collection(
            name=settings.chroma_collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    @property
    def collection(self):
        return self._collection

    def is_empty(self) -> bool:
        return self._collection.count() == 0

    def _embed(self, texts: list[str]) -> list[list[float]]:
        embeddings = self._embedding_model.encode(texts, normalize_embeddings=True)
        return embeddings.tolist()

    def add_chunks(self, ids: list[str], documents: list[str], metadatas: list[dict]):
        """Embeds text, then stores only embeddings and metadata in ChromaDB."""
        batch_size = 64
        for i in range(0, len(ids), batch_size):
            batch_docs = documents[i:i + batch_size]
            self._collection.upsert(
                ids=ids[i:i + batch_size],
                embeddings=self._embed(batch_docs),
                metadatas=metadatas[i:i + batch_size],
            )
        logger.info("Upserted %d chunk embeddings into ChromaDB", len(ids))

    def query(self, question: str, top_k: int | None = None) -> list[dict]:
        """Returns list of {id, metadata, distance} sorted by relevance."""
        k = top_k or settings.rag_top_k
        if self.is_empty():
            return []

        results = self._collection.query(
            query_embeddings=self._embed([question]),
            n_results=k,
            include=["metadatas", "distances"],
        )
        hits = []
        ids = results.get("ids", [[]])[0]
        metas = results.get("metadatas", [[]])[0]
        dists = results.get("distances", [[]])[0]
        for chunk_id, meta, dist in zip(ids, metas, dists):
            hits.append({"id": chunk_id, "metadata": meta or {}, "distance": dist})
        return hits

    def reset(self):
        try:
            self._client.delete_collection(settings.chroma_collection_name)
        except Exception:
            logger.info("ChromaDB collection did not exist before reset")
        self._collection = self._client.get_or_create_collection(
            name=settings.chroma_collection_name,
            metadata={"hnsw:space": "cosine"},
        )


@lru_cache
def get_vector_store() -> VectorStore:
    return VectorStore()
