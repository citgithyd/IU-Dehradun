"""
Guided Navigation engine.

Menu clicks NEVER use RAG. They load structured knowledge content directly
from PostgreSQL and the frontend renders it as cards/lists.
"""
from sqlalchemy.orm import Session

import models

NAV_MAP = {
    "about_ifhe": ["University/About_IFHE.json"],
    "schools": ["University/Schools.json"],
    "rankings": ["University/Rankings.json"],
    "programs.undergraduate": ["Programs/Undergraduate.json"],
    "programs.postgraduate": ["Programs/Postgraduate.json"],
    "programs.doctoral": ["Programs/Doctoral.json"],
    "programs.certificate": ["Programs/Certificate.json"],
    "campus_life": ["Campus_Life/Campus_Life_Summary.json"],
    "placements": ["Placements/Placements.json"],
    "admissions.calendar": ["Admissions/Admission_Calendar.json"],
    "admissions.process": ["Admissions/Admission_Process.json"],
    "admissions.eligibility": ["Admissions/Eligibility.json"],
    "admissions.scholarships": ["Admissions/Scholarships.json"],
    "admissions.faqs": ["Admissions/FAQs.json"],
}


class NavigationNotFound(Exception):
    pass


def _load_payload(db: Session, relative_path: str) -> dict:
    document = (
        db.query(models.KnowledgeDocument)
        .filter(
            models.KnowledgeDocument.source_path == relative_path,
            models.KnowledgeDocument.status == "published",
            models.KnowledgeDocument.is_deleted.is_(False),
        )
        .first()
    )
    if not document:
        raise NavigationNotFound(f"Knowledge base content not found in PostgreSQL: {relative_path}")
    return document.payload


def resolve_navigation(path: str, db: Session) -> dict:
    files = NAV_MAP.get(path)
    if not files:
        raise NavigationNotFound(f"Unknown navigation path: {path}")
    if len(files) == 1:
        return _load_payload(db, files[0])
    return {f.split("/")[-1].replace(".json", ""): _load_payload(db, f) for f in files}


def get_program_by_id(level: str, program_id: str, db: Session) -> dict | None:
    file_map = {
        "undergraduate": "Programs/Undergraduate.json",
        "postgraduate": "Programs/Postgraduate.json",
        "doctoral": "Programs/Doctoral.json",
        "certificate": "Programs/Certificate.json",
    }
    file_path = file_map.get(level.lower())
    if not file_path:
        return None
    data = _load_payload(db, file_path)
    for program in data.get("programs", []):
        if program.get("id") == program_id:
            return program
    return None
