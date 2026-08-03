"""
Guided Navigation engine.

Menu clicks NEVER use RAG — they load structured JSON directly and the
frontend renders it as cards/lists. This module maps a small set of known
navigation "paths" (sent by the frontend when a menu/card is tapped) to the
corresponding knowledge_base JSON file(s).
"""
from services.json_loader import load_json

# path -> knowledge_base relative file(s)
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


def resolve_navigation(path: str) -> dict:
    files = NAV_MAP.get(path)
    if not files:
        raise NavigationNotFound(f"Unknown navigation path: {path}")
    if len(files) == 1:
        return load_json(files[0])
    return {f.split("/")[-1].replace(".json", ""): load_json(f) for f in files}


def get_program_by_id(level: str, program_id: str) -> dict | None:
    """level: undergraduate | postgraduate | doctoral | certificate"""
    file_map = {
        "undergraduate": "Programs/Undergraduate.json",
        "postgraduate": "Programs/Postgraduate.json",
        "doctoral": "Programs/Doctoral.json",
        "certificate": "Programs/Certificate.json",
    }
    file_path = file_map.get(level.lower())
    if not file_path:
        return None
    data = load_json(file_path)
    for program in data.get("programs", []):
        if program.get("id") == program_id:
            return program
    return None
