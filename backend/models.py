import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship

from database import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    sessions = relationship("ChatSession", back_populates="user")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    current_topic = Column(String, nullable=True)  # tracked context, e.g. "MBA"
    interaction_count = Column(Integer, default=0)  # meaningful interactions, for lead trigger
    lead_prompted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")
    messages = relationship("ChatMessage", back_populates="session")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=gen_uuid)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # "user" | "bot"
    content = Column(Text, nullable=False)
    intent = Column(String, nullable=True)  # navigation | static | rag | conversation | fallback
    source = Column(String, nullable=True)  # e.g. json file name or "rag" or "static_config"
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")


class Lead(Base):
    __tablename__ = "leads"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=True)
    interest_topic = Column(String, nullable=True)
    contact_method = Column(String, nullable=True)  # "call" | "email"
    status = Column(String, default="new")  # new | contacted | closed
    created_at = Column(DateTime, default=datetime.utcnow)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, default=gen_uuid)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=True)
    message_id = Column(String, ForeignKey("chat_messages.id"), nullable=True)
    rating = Column(Integer, nullable=False)  # 1 (thumbs down) - 5, or simple 1/-1
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
