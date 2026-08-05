"""
Migrate IU Dehradun chatbot relational data from SQLite to PostgreSQL.

Usage examples:
  python migrate_sqlite_to_postgres.py
  python migrate_sqlite_to_postgres.py --source sqlite:///./data/iud_chatbot.db --target postgresql+psycopg2://postgres:***@localhost:5432/IU_DEHRADUN

Notes:
  - This copies table rows only (schema should already exist on target).
  - Target tables are cleared before copy to keep ids consistent.
"""

from __future__ import annotations

import argparse
from typing import Iterable

from sqlalchemy import create_engine, text

from config import get_settings
from database import Base
import models  # noqa: F401  # Ensure SQLAlchemy metadata is populated


COPY_TABLES_IN_ORDER = [
    "users",
    "chat_sessions",
    "knowledge_documents",
    "chat_messages",
    "feedback",
    "leads",
    "knowledge_chunks",
    "knowledge_resources",
]


def _parse_args() -> argparse.Namespace:
    settings = get_settings()
    parser = argparse.ArgumentParser(description="Migrate SQLite data to PostgreSQL")
    parser.add_argument(
        "--source",
        default="sqlite:///./data/iud_chatbot.db",
        help="Source SQLAlchemy URL (default: sqlite:///./data/iud_chatbot.db)",
    )
    parser.add_argument(
        "--target",
        default=settings.database_url,
        help="Target SQLAlchemy URL (default: DATABASE_URL from .env)",
    )
    return parser.parse_args()


def _assert_urls(source_url: str, target_url: str) -> None:
    if not source_url.startswith("sqlite"):
        raise ValueError(f"Expected SQLite source URL, got: {source_url}")
    if not target_url.startswith("postgresql"):
        raise ValueError(
            "Expected PostgreSQL target URL. Set DATABASE_URL to postgresql+psycopg2://..."
        )


def _clear_target_tables(conn, table_names: Iterable[str]) -> None:
    for table_name in reversed(list(table_names)):
        conn.execute(text(f'TRUNCATE TABLE "{table_name}" RESTART IDENTITY CASCADE'))


def _copy_table_rows(source_conn, target_conn, table_name: str) -> int:
    table = Base.metadata.tables[table_name]
    rows = [dict(row._mapping) for row in source_conn.execute(table.select()).fetchall()]
    if rows:
        target_conn.execute(table.insert(), rows)
    return len(rows)


def main() -> None:
    args = _parse_args()
    _assert_urls(args.source, args.target)

    source_engine = create_engine(args.source)
    target_engine = create_engine(args.target)

    # Ensure metadata is available on target before insert.
    Base.metadata.create_all(target_engine)

    with source_engine.begin() as source_conn, target_engine.begin() as target_conn:
        _clear_target_tables(target_conn, COPY_TABLES_IN_ORDER)

        total = 0
        for table_name in COPY_TABLES_IN_ORDER:
            copied = _copy_table_rows(source_conn, target_conn, table_name)
            total += copied
            print(f"{table_name}: copied {copied} rows")

    print(f"Migration complete. Total rows copied: {total}")


if __name__ == "__main__":
    main()
