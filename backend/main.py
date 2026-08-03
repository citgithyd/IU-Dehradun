import logging

import atexit
import subprocess
import webbrowser
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from config import get_settings
from database import init_db
from routers import chat, user, lead, feedback, navigation

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")
logger = logging.getLogger("ifhe_chatbot.main")

settings = get_settings()

frontend_process: subprocess.Popen | None = None

app = FastAPI(
    title="IU Dehradun AI Admission Counsellor API",
    description="Hybrid (Navigation + Static + RAG) chatbot backend for The ICFAI University, Dehradun.",
    version="1.0.0",
)


def _frontend_dir() -> Path:
    return Path(__file__).resolve().parent.parent / "frontend"


def _start_frontend_dev_server() -> None:
    global frontend_process
    if not settings.start_frontend:
        logger.info("Frontend startup disabled by settings.")
        return

    frontend_dir = _frontend_dir()
    if not frontend_dir.exists():
        logger.warning("Frontend directory not found at %s", frontend_dir)
        return

    try:
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev", "--", "--host", "127.0.0.1", "--port", "5174"],
            cwd=str(frontend_dir),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            shell=False,
        )
        logger.info("Frontend dev server starting from %s", frontend_dir)
    except FileNotFoundError:
        logger.warning("npm executable not found; frontend dev server could not be started.")


def _stop_frontend_dev_server() -> None:
    global frontend_process
    if frontend_process is None:
        return
    try:
        frontend_process.kill()
        frontend_process.wait(timeout=5)
        logger.info("Frontend dev server stopped.")
    except Exception:
        logger.warning("Failed to stop frontend dev server cleanly.")


def _open_frontend_url() -> None:
    if settings.open_browser:
        try:
            webbrowser.open(settings.frontend_dev_url)
            logger.info("Opening frontend in browser: %s", settings.frontend_dev_url)
        except Exception as exc:
            logger.warning("Could not open browser automatically: %s", exc)


@app.get("/", include_in_schema=False)
def root_redirect():
    return RedirectResponse(settings.frontend_dev_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
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
    _start_frontend_dev_server()
    _open_frontend_url()
    logger.info("IU Dehradun Chatbot API ready. Remember to run `python ingest.py` if the vector store is empty.")


a = None


@atexit.register
def on_exit():
    _stop_frontend_dev_server()


@app.get("/health")
def health():
    return {"status": "ok", "service": "iu-dehradun-chatbot-backend"}


app.include_router(chat.router)
app.include_router(user.router)
app.include_router(lead.router)
app.include_router(feedback.router)
app.include_router(navigation.router)
