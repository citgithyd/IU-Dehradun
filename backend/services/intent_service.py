"""
Intent Detection — the heart of the hybrid architecture.

Never sends every question to the LLM. Cheap, deterministic keyword/rule
matching decides the route FIRST; only "Knowledge Search" and unmatched
"Conversation" queries reach the LLM at all (and even then, Knowledge
Search is grounded via RAG, not free generation).

Route priority:
  1. Navigation      -> menu-click style structured paths (handled separately,
                         via the /navigate endpoint, not through detect_intent)
  2. Static           -> contact/logistics keywords -> STATIC_CONFIG lookup
  3. Conversation      -> greetings/small talk -> canned reply, no LLM/RAG
  4. Knowledge Search  -> everything else that matches a KB domain keyword -> RAG
  5. Fallback          -> nothing matched confidently
"""
import re
from dataclasses import dataclass
from typing import Literal

from config import STATIC_INTENT_KEYWORDS

IntentType = Literal["static", "conversation", "rag", "fallback"]

GREETING_PATTERNS = [
    r"^\s*(hi|hello|hey|good morning|good afternoon|good evening)\b",
    r"^\s*(thanks|thank you|thankyou|ok|okay|cool|great)\s*[!.]?\s*$",
    r"^\s*(bye|goodbye|see you)\b",
]

KNOWLEDGE_DOMAIN_KEYWORDS = [
    "eligibility", "eligible", "program", "course", "mba", "b.tech", "btech",
    "bba", "llb", "llm", "m.tech", "mtech", "phd", "ph.d", "placement",
    "package", "recruiter", "hostel", "scholarship", "fee", "fees", "faculty",
    "curriculum", "syllabus", "campus", "hostel", "library", "lab", "sports",
    "admission", "ranking", "rank", "accreditation", "naac", "ugc", "school",
    "about iu dehradun", "iu dehradun", "icfai dehradun", "icfai university",
    "vision", "mission", "duration", "career",
    "internship", "specialization", "certificate", "doctoral", "undergraduate",
    "postgraduate",
]


@dataclass
class IntentResult:
    intent: IntentType
    static_key: str | None = None


def detect_intent(message: str) -> IntentResult:
    text = message.strip().lower()

    if not text:
        return IntentResult(intent="fallback")

    # 1. Static — contact / logistics keywords (checked before conversation,
    #    e.g. "hi, what's your phone number" should still resolve to static)
    for static_key, keywords in STATIC_INTENT_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return IntentResult(intent="static", static_key=static_key)

    # 2. Conversation — greetings / small talk, short-circuits the LLM entirely
    for pattern in GREETING_PATTERNS:
        if re.search(pattern, text):
            return IntentResult(intent="conversation")

    # 3. Knowledge Search — matches a known KB domain -> RAG
    if any(kw in text for kw in KNOWLEDGE_DOMAIN_KEYWORDS):
        return IntentResult(intent="rag")

    # 4. If the message is a real question (has a question word or "?"),
    #    still try RAG rather than immediately failing — the KB may cover it
    #    even without an exact keyword hit.
    question_starters = ("what", "who", "when", "where", "why", "how", "which", "can", "does", "is", "are", "do")
    if text.endswith("?") or text.startswith(question_starters):
        return IntentResult(intent="rag")

    return IntentResult(intent="fallback")
