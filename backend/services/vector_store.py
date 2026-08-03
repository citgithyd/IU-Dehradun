"""
Vector store service: wraps ChromaDB + sentence-transformers.

Responsible for:
  - embedding text chunks with all-MiniLM-L6-v2
  - persisting them in a local ChromaDB collection
  - similarity search at query time (top-K retrieval for the RAG engine)
"""
import logging
from functools import lru_cache

import chromadb
from chromadb.utils import embedding_functions

from config import get_settings

logger = logging.getLogger("ifhe_chatbot.vector_store")
settings = get_settings()


class VectorStore:
    def __init__(self):
        self._client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        self._embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=settings.embedding_model
        )
        self._collection = self._client.get_or_create_collection(
            name=settings.chroma_collection_name,
            embedding_function=self._embedding_fn,
            metadata={"hnsw:space": "cosine"},
        )

    @property
    def collection(self):
        return self._collection

    def is_empty(self) -> bool:
        return self._collection.count() == 0

    def add_chunks(self, ids: list[str], documents: list[str], metadatas: list[dict]):
        """Upserts chunks in batches to avoid overwhelming the embedding model."""
        batch_size = 64
        for i in range(0, len(ids), batch_size):
            self._collection.upsert(
                ids=ids[i:i + batch_size],
                documents=documents[i:i + batch_size],
                metadatas=metadatas[i:i + batch_size],
            )
        logger.info("Upserted %d chunks into ChromaDB", len(ids))

    def query(self, question: str, top_k: int | None = None) -> list[dict]:
        """Returns list of {text, metadata, distance} sorted by relevance."""
        k = top_k or settings.rag_top_k
        if self.is_empty():
            return []
        results = self._collection.query(query_texts=[question], n_results=k)
        hits = []
        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0]
        dists = results.get("distances", [[]])[0]
        for doc, meta, dist in zip(docs, metas, dists):
            hits.append({"text": doc, "metadata": meta, "distance": dist})
        return hits

    def reset(self):
        self._client.delete_collection(settings.chroma_collection_name)
        self._collection = self._client.get_or_create_collection(
            name=settings.chroma_collection_name,
            embedding_function=self._embedding_fn,
            metadata={"hnsw:space": "cosine"},
        )


@lru_cache
def get_vector_store() -> VectorStore:
    return VectorStore()
