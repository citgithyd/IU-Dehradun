import logging

import webbrowser
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from config import get_settings
from database import init_db
from routers import chat, user, lead, feedback, navigation

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")
logger = logging.getLogger("ifhe_chatbot.main")

settings = get_settings()

app = FastAPI(
    title="IU Dehradun AI Admission Counsellor API",
    description="Hybrid (Navigation + Static + RAG) chatbot backend for The ICFAI University, Dehradun.",
    version="1.0.0",
)


def _frontend_dir() -> Path:
    return Path(__file__).resolve().parent.parent / "frontend"


def _frontend_dist_dir() -> Path:
    return _frontend_dir() / "dist"


def _open_frontend_url() -> None:
    if settings.open_browser:
        try:
            webbrowser.open(settings.app_url)
            logger.info("Opening app in browser: %s", settings.app_url)
        except Exception as exc:
            logger.warning("Could not open browser automatically: %s", exc)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    try:
        body = (await request.body()).decode("utf-8")
    except Exception:
        body = "<unreadable body>"
    logger.warning(
        "Validation failed for %s %s; body=%s; errors=%s",
        request.method,
        request.url.path,
        body,
        exc.errors(),
    )
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Invalid request JSON or schema. Check the payload format.",
            "errors": exc.errors(),
        },
    )


@app.on_event("startup")
def on_startup():
    init_db()
    logger.info("Database initialized.")
    if not _frontend_dist_dir().exists():
        logger.warning(
            "Frontend build not found at %s. Run `cd frontend && npm install && npm run build`.",
            _frontend_dist_dir(),
        )
    _open_frontend_url()
    logger.info("IU Dehradun Chatbot API ready. Remember to run `python ingest.py` if the vector store is empty.")


a = None


@app.get("/health")
def health():
    return {"status": "ok", "service": "iu-dehradun-chatbot-backend"}


app.include_router(chat.router)
app.include_router(user.router)
app.include_router(lead.router)
app.include_router(feedback.router)
app.include_router(navigation.router)


frontend_dist_dir = _frontend_dist_dir()
if frontend_dist_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist_dir), html=True), name="frontend")
else:
    logger.warning("Frontend is not mounted because build output does not exist at %s", frontend_dist_dir)
