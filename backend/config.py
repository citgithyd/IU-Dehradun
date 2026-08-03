"""
Central application configuration.

Holds environment-driven settings AND the hardcoded static config
(contact details, URLs) that must NEVER be answered via RAG, per the
"Static Responses" section of the spec.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    groq_api_key: str = Field(default="", alias="GROQ_API_KEY")
    groq_model: str = Field(default="llama-3.3-70b-versatile", alias="GROQ_MODEL")

    database_url: str = Field(default="sqlite:///./data/iud_chatbot.db", alias="DATABASE_URL")

    chroma_persist_dir: str = Field(default="./data/chroma_store", alias="CHROMA_PERSIST_DIR")
    chroma_collection_name: str = Field(default="iud_knowledge_base", alias="CHROMA_COLLECTION_NAME")

    embedding_model: str = Field(default="all-MiniLM-L6-v2", alias="EMBEDDING_MODEL")

    allowed_origins: str = Field(default="http://127.0.0.1:5174", alias="ALLOWED_ORIGINS")

    frontend_dev_url: str = Field(default="http://127.0.0.1:5174", alias="FRONTEND_DEV_URL")
    start_frontend: bool = Field(default=True, alias="START_FRONTEND")
    open_browser: bool = Field(default=True, alias="OPEN_BROWSER")

    rag_top_k: int = Field(default=5, alias="RAG_TOP_K")
    lead_trigger_threshold: int = Field(default=2, alias="LEAD_TRIGGER_THRESHOLD")

    class Config:
        env_file = ".env"
        populate_by_name = True

    @property
    def cors_origins(self) -> list[str]:
        origins = [o.strip() for o in self.allowed_origins.split(",") if o.strip()]
        if self.frontend_dev_url and self.frontend_dev_url not in origins:
            origins.append(self.frontend_dev_url)
        return origins

    @property
    def ai_api_key(self) -> str:
        return self.groq_api_key


@lru_cache
def get_settings() -> Settings:
    return Settings()


# ---------------------------------------------------------------------------
# STATIC CONFIG — never hallucinated, never routed through RAG or the LLM.
# Edit these values directly for your institution.
# ---------------------------------------------------------------------------
STATIC_CONFIG = {
    "institution_name": "The ICFAI University, Dehradun (IU Dehradun)",
    "phone": "18001208727",
    "email": "admissions@iudehradun.edu.in",
    "website": "https://www.iudehradun.edu.in",
    "apply_now_url": "https://www.iudehradun.edu.in/admissions/online-registration",
    "google_maps_url": "https://maps.google.com/?q=The+ICFAI+University+Dehradun+Rajawala+Road+Selaqui+Dehradun",
    "address": "Rajawala Road, Selaqui, Dehradun - 248197, Uttarakhand",
    "office_hours": "Monday - Saturday, 9:30 AM - 5:30 PM (IST); Admission Office also open Saturdays & Sundays during peak admission season",
    "admission_contact": "Toll Free: 1800-120-8727; Dehradun City Office: +91 9319056601; Lucknow City Office: +91 9589208770; Patna City Office: +91 9308272793; Email: admissions@iudehradun.edu.in",
    "social_links": {
        "facebook": "https://www.facebook.com/IUDehradun.Official/",
        "instagram": "https://www.instagram.com/iudehradun/",
        "linkedin": "https://www.linkedin.com/company/icfai-university-dehradun/",
        "youtube": "https://www.youtube.com/theicfaiuniversitydehradun4001",
        "twitter": "https://x.com/icfaidehradun",
    },
}

# Keyword -> static config key routing table used by the intent/static engine
STATIC_INTENT_KEYWORDS = {
    "phone": ["phone", "call", "contact number", "mobile", "helpline"],
    "email": ["email", "e-mail", "mail id"],
    "website": ["website", "site", "url", "web address"],
    "address": ["address", "location", "where is", "campus address"],
    "google_maps_url": ["map", "directions", "how to reach"],
    "apply_now_url": ["apply now", "application link", "how to apply online", "apply link"],
    "office_hours": ["office hours", "timing", "open hours", "working hours"],
    "admission_contact": ["admission office", "admission contact", "counsellor contact"],
}
