import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, JSON, String, Text, UniqueConstraint
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


class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"
    __table_args__ = (
        UniqueConstraint("source_path", name="uq_knowledge_documents_source_path"),
        UniqueConstraint("navigation_path", name="uq_knowledge_documents_navigation_path"),
        Index("ix_knowledge_documents_category_type", "category", "content_type"),
        Index("ix_knowledge_documents_status", "status"),
    )

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    content_type = Column(String, nullable=False, index=True)
    source_path = Column(String, nullable=True)
    navigation_path = Column(String, nullable=True)
    external_id = Column(String, nullable=True, index=True)
    payload = Column(JSON, nullable=False)
    body_text = Column(Text, nullable=True)
    checksum = Column(String, nullable=True, index=True)
    status = Column(String, nullable=False, default="published")
    version = Column(Integer, nullable=False, default=1)
    is_deleted = Column(Boolean, nullable=False, default=False)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    chunks = relationship("KnowledgeChunk", back_populates="document", cascade="all, delete-orphan")
    resources = relationship("KnowledgeResource", back_populates="document", cascade="all, delete-orphan")


class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"
    __table_args__ = (
        UniqueConstraint("document_id", "chunk_key", name="uq_knowledge_chunks_document_chunk_key"),
        Index("ix_knowledge_chunks_active", "is_active"),
    )

    id = Column(String, primary_key=True, default=gen_uuid)
    document_id = Column(String, ForeignKey("knowledge_documents.id"), nullable=False, index=True)
    chunk_key = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=False, default=dict)
    embedding_version = Column(String, nullable=True)
    checksum = Column(String, nullable=True, index=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    document = relationship("KnowledgeDocument", back_populates="chunks")


class KnowledgeResource(Base):
    __tablename__ = "knowledge_resources"
    __table_args__ = (
        UniqueConstraint("document_id", "resource_type", "label", name="uq_knowledge_resources_document_type_label"),
        Index("ix_knowledge_resources_type", "resource_type"),
    )

    id = Column(String, primary_key=True, default=gen_uuid)
    document_id = Column(String, ForeignKey("knowledge_documents.id"), nullable=True, index=True)
    resource_type = Column(String, nullable=False)
    label = Column(String, nullable=False)
    value = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=False, default=dict)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    document = relationship("KnowledgeDocument", back_populates="resources")
