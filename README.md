# ICFAI University Dehradun AI Admission Counsellor — Full Stack Chatbot

A production-ready hybrid AI chatbot for ICFAI University Dehradun,
combining **Guided Navigation**, **Static Responses**, and **RAG (Groq + ChromaDB)**.

```
User
 ↓
Intent Detection (services/intent_service.py)
 ↓
 ├── Navigation        → raw JSON, no LLM      (routers/navigation.py)
 ├── Static Response    → contact/logistics      (services/static_service.py)
 ├── Knowledge Search    → RAG via Groq            (services/rag_service.py)
 ├── Conversation         → canned replies           (routers/chat.py)
 └── Fallback              → lightweight Groq reply
 ↓
Final Response
```

## Quick start

**Backend + frontend (single runtime command):**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # add your GROQ_API_KEY

# Build frontend once (or after frontend changes)
cd ../frontend
npm install
npm run build
cd ../backend

python ingest.py            # embed knowledge_base/*.json into ChromaDB
uvicorn main:app --reload --port 8000
```

**Optional frontend dev server (hot reload UI work):**
```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Visit http://localhost:8000 for normal run mode, or http://localhost:5173 when using Vite dev mode.

## What's implemented

- **Welcome screen + lead form** (Name/Email/Phone/City/State, validated) → `POST /save-user`
- **Home menu** with quick-action cards (About ICFAI University Dehradun, Programs, Campus Life, Placements,
  Admission Calendar, Apply Now, Ask Anything)
- **Guided navigation**: Undergraduate → Schools → Courses → Course Detail, each loaded
  directly from JSON (`GET /navigate/...`), never through the LLM
- **"Ask AI about this course"** — keeps program context active for follow-ups
- **RAG-powered "Ask Anything"** using Groq Llama 3.3 70B, grounded strictly in `knowledge_base/*.json`
  via ChromaDB + `all-MiniLM-L6-v2` embeddings; replies with a fixed "not found" message
  rather than hallucinating
- **Context memory** — the backend tracks a lightweight `current_topic` per session so
  "what about placements?" resolves against the last program discussed
- **Follow-up suggestion chips** ("You may also ask...") after every answer
- **Lead generation** — after a few meaningful interactions on fee/eligibility/admission/
  hostel/placement topics, the bot asks "Would you like an Admission Counsellor to
  contact you?" (Yes / Email Me / Not Now) → `POST /lead`
- **Feedback** (thumbs up/down) on RAG answers → `POST /feedback`
- **Chat history persistence** in SQLite (`ChatSession`, `ChatMessage`)
- **New Chat** control that resets context

## Notes on scope

The knowledge base ships with a representative but non-exhaustive set of programs
(a handful per level) and sample statistics — enough for the full architecture to
run end-to-end. Add more JSON records following the existing shape in
`backend/knowledge_base/`, then re-run `python ingest.py`; nothing in the code is
hardcoded to specific courses.

Swap `GROQ_MODEL` in `backend/.env` to another Groq model you have access to.
