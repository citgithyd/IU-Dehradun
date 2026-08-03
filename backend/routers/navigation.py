from fastapi import APIRouter, HTTPException

from services.navigation_service import resolve_navigation, get_program_by_id, NavigationNotFound

router = APIRouter(tags=["Navigation"])


@router.get("/navigate/{path:path}")
def navigate(path: str):
    """
    Menu-click navigation — loads raw JSON directly, no RAG/LLM involved.
    Example paths: about_ifhe, programs.undergraduate, campus_life, admissions.faqs
    """
    try:
        return resolve_navigation(path)
    except NavigationNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/programs/{level}/{program_id}")
def program_detail(level: str, program_id: str):
    program = get_program_by_id(level, program_id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program
