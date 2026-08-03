"""
RAG Engine — Retrieval Augmented Generation using Groq.

Pipeline (per spec):
  User Question -> Embedding -> Search ChromaDB -> Retrieve Top-K chunks
  -> Pass Context + Question to Groq -> Generate Answer

The model is instructed to answer ONLY from retrieved context and to
return the exact fallback string if the answer isn't present, to avoid
hallucination.
"""
import logging

from groq import Groq

from config import get_settings
from services.vector_store import get_vector_store

logger = logging.getLogger("ifhe_chatbot.rag")
settings = get_settings()

NOT_FOUND_REPLY = "I couldn't find this information in the IU Dehradun knowledge base."

SYSTEM_INSTRUCTION = """You are IU Dehradun AI Assistant, a professional and friendly university admission \
counsellor chatbot for The ICFAI University, Dehradun (IU Dehradun).

Rules you MUST follow:
1. Answer ONLY using the information given in the CONTEXT below. Never invent facts, numbers, dates, \
   fees, or figures that are not present in the context.
2. If the context does not contain enough information to answer, reply EXACTLY with:
   "I couldn't find this information in the IU Dehradun knowledge base."
3. Keep answers concise, warm, and easy to scan — use short paragraphs or bullet points where helpful.
4. Do not mention "context", "knowledge base chunks", or that you are an AI retrieving documents — \
   just answer naturally as a knowledgeable admission counsellor.
5. If prior conversation topic is provided, resolve ambiguous follow-up questions (e.g. "what about \
   placements?") against that topic.
"""

_model = None


def _get_model():
    global _model
    if _model is None:
        if not settings.ai_api_key:
            logger.warning("GROQ_API_KEY is not set — RAG generation will fail until configured.")
        _model = Groq(api_key=settings.ai_api_key)
    return _model


def _generate_text(prompt: str) -> str:
    client = _get_model()
    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )
    return (response.choices[0].message.content or "").strip()


def answer_with_rag(question: str, current_topic: str | None = None) -> tuple[str, list[str]]:
    """
    Returns (answer_text, list_of_source_files_used).
    """
    store = get_vector_store()
    search_query = f"{current_topic}: {question}" if current_topic else question
    hits = store.query(search_query, top_k=settings.rag_top_k)

    if not hits:
        return NOT_FOUND_REPLY, []

    context_blocks = []
    sources = []
    for hit in hits:
        context_blocks.append(hit["text"])
        src = hit.get("metadata", {}).get("source_file")
        if src and src not in sources:
            sources.append(src)

    context_text = "\n\n".join(f"- {c}" for c in context_blocks)
    topic_line = f"Conversation topic so far: {current_topic}\n" if current_topic else ""

    prompt = f"""{topic_line}CONTEXT:
{context_text}

QUESTION: {question}

Answer the question using only the CONTEXT above, following your rules."""

    try:
        answer = _generate_text(prompt) or NOT_FOUND_REPLY
    except Exception:
        logger.exception("Groq generation failed")
        answer = "Sorry, I'm having trouble generating a response right now. Please try again in a moment."

    return answer, sources


def generate_conversational_reply(message: str) -> str:
    """Lightweight LLM call for genuine free-form chit-chat that isn't in the KB domain
    but also isn't a greeting (those are handled without any LLM call at all)."""
    try:
        prompt = (
            "The user said something conversational/off-topic to a university admissions "
            f"chatbot for IU Dehradun: \"{message}\". Reply briefly and warmly in 1-2 sentences, and "
            "gently steer them back to how you can help with programs, admissions, campus life, "
            "placements or scholarships at IU Dehradun."
        )
        return _generate_text(prompt)
    except Exception:
        logger.exception("Groq conversational reply failed")
        return "I'm here to help with anything about IU Dehradun — programs, admissions, campus life, placements or scholarships. What would you like to know?"
