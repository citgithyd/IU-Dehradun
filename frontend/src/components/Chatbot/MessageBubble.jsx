import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";

import UserDetailsForm from "./UserDetailsForm.jsx";
import QuickActionCards from "./QuickActionCards.jsx";
import ProgramTypeSelector from "./ProgramTypeSelector.jsx";
import ProgramGroupSelector from "./ProgramGroupSelector.jsx";
import CourseList from "./CourseList.jsx";
import CourseDetail from "./CourseDetail.jsx";
import NavDataCard from "./NavDataCard.jsx";
import FollowUpSuggestions from "./FollowUpSuggestions.jsx";
import LeadCapturePrompt from "./LeadCapturePrompt.jsx";
import KnowMorePrompt from "./KnowMorePrompt.jsx";

function BotTextBubble({ msg, chat, showBack }) {
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState(null);

  const handleCopy = () => {
    if (chat.disabled) return;
    navigator.clipboard?.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRate = (rating) => {
    if (chat.disabled) return;
    setRated(rating);
    chat.sendFeedback(msg.messageId, rating === "up" ? 5 : 1);
  };

  return (
    <div className="max-w-[280px]">
      <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble px-4 py-3 text-[13.5px] text-ifhe-900 ifhe-markdown">
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
      {msg.intent === "rag" && (
        <div className="flex items-center gap-2.5 mt-1 ml-1">
          <button onClick={handleCopy} disabled={chat.disabled} className="text-ifhe-900/35 hover:text-ifhe-900/70 transition" aria-label="Copy">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          <button
            onClick={() => handleRate("up")}
            disabled={chat.disabled}
            className={`transition ${rated === "up" ? "text-emerald-600" : "text-ifhe-900/35 hover:text-ifhe-900/70"}`}
            aria-label="Good response"
          >
            <ThumbsUp size={13} />
          </button>
          <button
            onClick={() => handleRate("down")}
            disabled={chat.disabled}
            className={`transition ${rated === "down" ? "text-red-500" : "text-ifhe-900/35 hover:text-ifhe-900/70"}`}
            aria-label="Bad response"
          >
            <ThumbsDown size={13} />
          </button>
        </div>
      )}
      <FollowUpSuggestions
        suggestions={msg.suggestions || []}
        onPick={(q) => chat.sendFreeText(q)}
        showBack={showBack}
        onBack={chat.goHome}
        disabled={chat.disabled}
      />
    </div>
  );
}

export default function MessageBubble({ msg, chat, showBack = false }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-[240px] bg-ifhe-800 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-[13.5px] shadow-bubble">
          {msg.content}
        </div>
      </div>
    );
  }

  // Bot messages: avatar + content, content varies by type
  let content;
  let showBackChips = showBack;
  switch (msg.type) {
    case "form":
      content = <UserDetailsForm onSubmit={chat.submitUserForm} disabled={chat.disabled} />;
      break;
    case "quickActions":
      showBackChips = false;
      content = (
        <QuickActionCards content={msg.content} actions={msg.actions} onSelect={chat.navigateTo} disabled={chat.disabled} />
      );
      break;
    case "backActions":
      return null;
    case "programTypes":
      content = <ProgramTypeSelector content={msg.content} onSelect={chat.selectProgramLevel} disabled={chat.disabled} />;
      break;
    case "programGroups":
      content = (
        <ProgramGroupSelector
          content={msg.content}
          groups={msg.groups}
          onSelect={(group) => chat.selectProgramGroup(msg.level, group)}
          disabled={chat.disabled}
        />
      );
      break;
    case "courseList":
      content = <CourseList level={msg.level} programs={msg.programs} onSelectCourse={chat.selectCourse} disabled={chat.disabled} />;
      break;
    case "courseDetail":
      content = <CourseDetail program={msg.program} onAskAi={chat.askAiAboutCourse} disabled={chat.disabled} />;
      break;
    case "navData":
      content = <NavDataCard navKey={msg.navKey} data={msg.data} />;
      break;
    case "leadPrompt":
      content = <LeadCapturePrompt onRespond={chat.respondToLeadPrompt} disabled={chat.disabled} />;
      break;
    case "knowMorePrompt":
      content = <KnowMorePrompt onKnowMore={chat.showUserDetailsForm} disabled={chat.disabled} />;
      break;
    default:
      content = <BotTextBubble msg={msg} chat={chat} showBack={showBack} />;
      showBackChips = false;
  }

  return (
    <div className="flex items-end gap-2 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-ifhe-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        IF
      </div>
      <div>
        {content}
        {showBackChips && <FollowUpSuggestions showBack onBack={chat.goHome} disabled={chat.disabled} />}
      </div>
    </div>
  );
}
