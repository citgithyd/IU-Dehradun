import uuid
import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from database import get_db
from config import get_settings
from schemas import ChatRequest, ChatResponse
from services.intent_service import detect_intent
from services.static_service import get_static_response
from services.rag_service import answer_with_rag, generate_conversational_reply, NOT_FOUND_REPLY
from services.suggestion_service import get_follow_up_suggestions, is_lead_trigger_topic

logger = logging.getLogger("ifhe_chatbot.chat")
router = APIRouter(tags=["Chat"])
settings = get_settings()

CONVERSATION_REPLIES = {
    "greeting": "Hi there! 👋 I'm the IU Dehradun AI Assistant. I can help you with Programs, Admissions, "
                "Campus Life, Placements and Scholarships. What would you like to know?",
    "thanks": "You're welcome! Is there anything else you'd like to know about IU Dehradun? 😊",
    "bye": "Thanks for chatting! Feel free to come back anytime you have questions about IU Dehradun. Good luck! 🎓",
}


def _classify_topic(message: str) -> str | None:
    text = message.lower()
    if any(k in text for k in ["mba", "b.tech", "btech", "bba", "llb", "llm", "m.tech", "mtech", "phd", "program", "course"]):
        return "programs"
    if any(k in text for k in ["placement", "package", "recruiter", "internship"]):
        return "placements"
    if any(k in text for k in ["hostel", "campus", "sports", "club", "library"]):
        return "campus_life"
    if any(k in text for k in ["scholarship", "financial aid"]):
        return "scholarships"
    if any(k in text for k in ["admission", "eligibility", "apply", "fee"]):
        return "admissions"
    return None


def _get_or_create_session(db: Session, session_id: str | None, user_id: str | None) -> models.ChatSession:
    if session_id:
        session = db.query(models.ChatSession).filter_by(id=session_id).first()
        if session:
            return session
    session = models.ChatSession(id=str(uuid.uuid4()), user_id=user_id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    session = _get_or_create_session(db, payload.session_id, payload.user_id)
    message = payload.message.strip()

    # Log the user's message
    db.add(models.ChatMessage(session_id=session.id, role="user", content=message))

    result = detect_intent(message)
    reply_text = ""
    source = None
    intent = result.intent
    topic = session.current_topic

    if intent == "static":
        reply_text = get_static_response(result.static_key)
        source = "static_config"

    elif intent == "conversation":
        text_lower = message.lower()
        if any(w in text_lower for w in ["bye", "goodbye", "see you"]):
            reply_text = CONVERSATION_REPLIES["bye"]
        elif any(w in text_lower for w in ["thanks", "thank you", "ok", "okay", "cool", "great"]):
            reply_text = CONVERSATION_REPLIES["thanks"]
        else:
            reply_text = CONVERSATION_REPLIES["greeting"]
        source = "conversation_engine"

    elif intent == "rag":
        new_topic = _classify_topic(message)
        active_topic = new_topic or topic
        reply_text, sources = answer_with_rag(message, current_topic=active_topic)
        source = ", ".join(sources) if sources else "rag"
        topic = active_topic
        session.interaction_count = (session.interaction_count or 0) + 1

    else:  # fallback
        reply_text = generate_conversational_reply(message)
        source = "fallback_conversational"

    session.current_topic = topic

    # Lead generation: after N meaningful interactions on lead-trigger topics, prompt once per session
    lead_prompt = False
    if (
        intent == "rag"
        and is_lead_trigger_topic(message)
        and not session.lead_prompted
        and (session.interaction_count or 0) >= settings.lead_trigger_threshold
    ):
        lead_prompt = True
        session.lead_prompted = True

    suggestions = get_follow_up_suggestions(topic) if intent in ("rag", "conversation") else []

    bot_msg = models.ChatMessage(
        session_id=session.id, role="bot", content=reply_text, intent=intent, source=source
    )
    db.add(bot_msg)
    db.commit()

    return ChatResponse(
        session_id=session.id,
        reply=reply_text,
        intent=intent,
        source=source,
        suggestions=suggestions,
        lead_prompt=lead_prompt,
        data=None,
    )
