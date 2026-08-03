import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-ifhe-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        IF
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-bubble flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-ifhe-400 animate-bounce-dot" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-ifhe-400 animate-bounce-dot" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-ifhe-400 animate-bounce-dot" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
