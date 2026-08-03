"""
Loads JSON files from the knowledge_base/ directory tree.

Used by BOTH:
  - the navigation engine (raw JSON served directly to the frontend, no RAG)
  - the ingestion script (chunked + embedded into ChromaDB for RAG)
"""
import json
import os
from pathlib import Path
from typing import Any

KB_ROOT = Path(__file__).resolve().parent.parent / "knowledge_base"


def load_json(relative_path: str) -> dict[str, Any]:
    """relative_path example: 'Programs/Undergraduate.json'"""
    full_path = KB_ROOT / relative_path
    if not full_path.exists():
        raise FileNotFoundError(f"Knowledge base file not found: {relative_path}")
    with open(full_path, "r", encoding="utf-8") as f:
        return json.load(f)


def list_all_json_files() -> list[Path]:
    return sorted(KB_ROOT.rglob("*.json"))


def category_from_path(path: Path) -> str:
    """Derive a human-readable category from folder name, e.g. 'Programs'."""
    return path.parent.name.replace("_", " ")
