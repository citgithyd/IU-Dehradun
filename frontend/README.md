# ICFAI University Dehradun AI Admission Assistant — Frontend

React + Vite + TailwindCSS + Framer Motion floating chatbot widget.

## Setup

```bash
cd frontend
npm install
cp .env.example .env     # point VITE_API_BASE_URL at your backend
npm run dev
```

Open http://localhost:5173 — the purple chat bubble in the bottom-right is the widget.

## Embedding in an existing site

`ChatWidget` (`src/components/Chatbot/ChatWidget.jsx`) is fully self-contained
and fixed-positioned. Drop it into any React page/layout:

```jsx
import ChatWidget from "./components/Chatbot/ChatWidget";

function Layout() {
  return (
    <>
      {/* rest of your site */}
      <ChatWidget />
    </>
  );
}
```

## Structure

```
src/
  components/Chatbot/
    ChatWidget.jsx        # floating button + panel container, input bar, auto-scroll
    ChatHeader.jsx         # purple header, close/maximize/new-chat
    MessageBubble.jsx      # dispatches each message to the right card type
    UserDetailsForm.jsx    # welcome-screen lead form (validated)
    QuickActionCards.jsx   # home menu quick-action grid
    ProgramTypeSelector.jsx
    CourseList.jsx / CourseDetail.jsx
    NavDataCard.jsx        # generic renderer for About/Campus Life/Placements/Admissions JSON
    FollowUpSuggestions.jsx
    LeadCapturePrompt.jsx
    TypingIndicator.jsx
  hooks/useChat.js         # all chat state + API orchestration
  services/api.js          # thin fetch wrapper around the backend REST API
```

Menu-driven flows (Programs, Campus Life, etc.) call `GET /navigate/...` and
render structured JSON directly — no LLM involved, per the hybrid architecture.
Free-text messages call `POST /chat`, which the backend routes through
intent detection to Static / RAG (Gemini) / Conversation / Fallback.
