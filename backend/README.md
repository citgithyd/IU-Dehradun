# ICFAI University Dehradun AI Admission Counsellor — Backend

FastAPI backend implementing the hybrid chatbot architecture:

```
User → Intent Detection → [Navigation | Static Response | RAG Engine] → Response
```

## Stack
- **FastAPI** — REST API
- **SQLAlchemy + PostgreSQL (or SQLite for local fallback)** — users, chat sessions/history, leads, feedback
- **ChromaDB** — vector store (persisted locally)
- **sentence-transformers (all-MiniLM-L6-v2)** — embeddings
- **Groq Llama 3.3 70B** — grounded answer generation for the RAG engine

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env and set GROQ_API_KEY

# Build frontend once (or whenever frontend code changes)
cd ../frontend
npm install
npm run build
cd ../backend

# Build the vector store from knowledge_base/*.json (run once, and again after editing JSON files)
python ingest.py

# Start backend + served frontend
uvicorn main:app --reload --port 8000
```

App: http://localhost:8000
API docs: http://localhost:8000/docs

## Migrate SQLite data to PostgreSQL

1. Set PostgreSQL URL in `.env`:

```bash
DATABASE_URL=postgresql+psycopg2://<user>:<password>@localhost:5432/IU_DEHRADUN
```

2. Apply schema migrations to PostgreSQL:

```bash
alembic upgrade head
```

3. Copy existing relational data from SQLite into PostgreSQL:

```bash
python migrate_sqlite_to_postgres.py --source sqlite:///./data/iud_chatbot.db
```

4. Rebuild vector embeddings from PostgreSQL content:

```bash
python ingest.py
```

5. Start API using PostgreSQL-backed configuration:

```bash
uvicorn main:app --reload --port 8080
```

## Architecture

| Intent           | Handler                          | Uses RAG/LLM? |
|-------------------|-----------------------------------|:---:|
| Navigation        | `routers/navigation.py` → raw JSON | ❌ |
| Static Response    | `services/static_service.py` → `config.STATIC_CONFIG` | ❌ |
| Knowledge Search   | `services/rag_service.py` → ChromaDB + Groq Llama 3.3 70B | ✅ |
| Conversation        | canned replies in `routers/chat.py` | ❌ |
| Fallback            | short Groq reply that steers back on-topic | ✅ (lightweight) |

Intent routing lives in `services/intent_service.py` — pure keyword/rule based,
so trivial questions never hit the LLM.

## Editing the knowledge base

Everything except contact details lives in `knowledge_base/**/*.json`. Edit or
add JSON files following the existing shape, then re-run `python ingest.py` to
re-embed them into ChromaDB. Contact details (phone/email/address/etc.) live
in `config.py → STATIC_CONFIG` and are never routed through RAG.

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/chat` | Main hybrid chat endpoint |
| GET  | `/navigate/{path}` | Menu-click navigation (e.g. `/navigate/programs.undergraduate`) |
| GET  | `/programs/{level}/{program_id}` | Single course/program detail |
| POST | `/save-user` | Save the welcome-screen lead form |
| POST | `/lead` | Save an "Admission Counsellor contact me" lead |
| POST | `/feedback` | Thumbs up/down on a bot message |
| GET  | `/health` | Health check |
