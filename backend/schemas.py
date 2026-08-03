from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, field_validator
import re

PHONE_RE = re.compile(r"^\+?[0-9]{7,15}$")


# ---------- User ----------
class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[ \-\.\(\)]", "", v)
        if not PHONE_RE.match(cleaned):
            raise ValueError("Invalid phone number")
        return cleaned


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    city: str
    state: str

    class Config:
        from_attributes = True


# ---------- Chat ----------
class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: Optional[str] = None
    user_id: Optional[str] = None


class Suggestion(BaseModel):
    label: str
    query: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    intent: Literal["navigation", "static", "rag", "conversation", "fallback"]
    source: Optional[str] = None
    suggestions: list[Suggestion] = []
    lead_prompt: bool = False
    data: Optional[dict] = None  # structured payload for navigation responses (JSON content)


# ---------- Navigation ----------
class NavigationRequest(BaseModel):
    path: str  # e.g. "programs.undergraduate.ICFAI Business School"
    session_id: Optional[str] = None


# ---------- Lead ----------
class LeadCreate(BaseModel):
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    interest_topic: Optional[str] = None
    contact_method: Literal["call", "email"]


class LeadOut(BaseModel):
    id: str
    status: str

    class Config:
        from_attributes = True


# ---------- Feedback ----------
class FeedbackCreate(BaseModel):
    session_id: Optional[str] = None
    message_id: Optional[str] = None
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None
