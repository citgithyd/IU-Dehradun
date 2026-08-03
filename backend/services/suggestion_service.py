"""
Generates "You may also ask" follow-up suggestions after every bot answer,
and decides whether a lead-capture prompt should fire.

Kept rule-based (not LLM-generated) so it's fast, predictable and free.
"""
from schemas import Suggestion

DEFAULT_SUGGESTIONS = [
    Suggestion(label="Fees & Scholarships", query="What scholarships are available?"),
    Suggestion(label="Placements", query="Tell me about placement statistics"),
    Suggestion(label="Hostel", query="Tell me about hostel facilities"),
    Suggestion(label="Eligibility", query="What is the eligibility criteria?"),
    Suggestion(label="Admission Process", query="What is the admission process?"),
]

TOPIC_SUGGESTIONS = {
    "programs": [
        Suggestion(label="Eligibility", query="What is the eligibility for this program?"),
        Suggestion(label="Fees & Scholarships", query="What scholarships are available?"),
        Suggestion(label="Placements", query="What are the placement outcomes for this program?"),
        Suggestion(label="Admission Process", query="What is the admission process?"),
    ],
    "admissions": [
        Suggestion(label="Eligibility", query="What is the eligibility criteria?"),
        Suggestion(label="Scholarships", query="What scholarships are available?"),
        Suggestion(label="Admission Calendar", query="What is the admission calendar?"),
    ],
    "placements": [
        Suggestion(label="Top Recruiters", query="Who are the top recruiters?"),
        Suggestion(label="Internships", query="Tell me about internship opportunities"),
        Suggestion(label="Programs", query="Which programs have the best placements?"),
    ],
    "campus_life": [
        Suggestion(label="Hostel", query="Tell me about hostel facilities"),
        Suggestion(label="Sports", query="What sports facilities are available?"),
        Suggestion(label="Clubs", query="What student clubs can I join?"),
    ],
    "scholarships": [
        Suggestion(label="Eligibility", query="What is the eligibility criteria?"),
        Suggestion(label="Admission Process", query="What is the admission process?"),
        Suggestion(label="Fees", query="What are the program fees?"),
    ],
}

LEAD_TRIGGER_KEYWORDS = [
    "fee", "fees", "eligibility", "admission", "application", "apply",
    "hostel", "placement", "scholarship", "cost", "tuition",
]


def get_follow_up_suggestions(topic: str | None) -> list[Suggestion]:
    if topic and topic.lower() in TOPIC_SUGGESTIONS:
        return TOPIC_SUGGESTIONS[topic.lower()]
    return DEFAULT_SUGGESTIONS


def is_lead_trigger_topic(message: str) -> bool:
    text = message.lower()
    return any(kw in text for kw in LEAD_TRIGGER_KEYWORDS)
