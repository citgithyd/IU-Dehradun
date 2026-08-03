"""
Static Response Engine.

Serves contact/logistics answers directly from STATIC_CONFIG.
NEVER touches the LLM or the vector store — these facts must be exact
and consistent every time.
"""
from config import STATIC_CONFIG

STATIC_TEMPLATES = {
    "phone": "You can reach IU Dehradun Admissions at 📞 {phone}.",
    "email": "You can email the admissions team at ✉️ {email}.",
    "website": "Visit the official IU Dehradun website: 🌐 {website}",
    "address": "IU Dehradun campus address: 📍 {address}",
    "google_maps_url": "Here are directions to the IU Dehradun campus: {google_maps_url}",
    "apply_now_url": "You can apply online here: {apply_now_url}",
    "office_hours": "Our office hours are: 🕒 {office_hours}",
    "admission_contact": "You can reach the Admission Office at: {admission_contact}",
}


def get_static_response(static_key: str) -> str:
    template = STATIC_TEMPLATES.get(static_key)
    if not template:
        return f"{STATIC_CONFIG.get(static_key, 'Information not available.')}"
    return template.format(**STATIC_CONFIG)
