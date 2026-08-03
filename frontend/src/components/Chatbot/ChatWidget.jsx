import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ChatHeader from "./ChatHeader.jsx";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import { useChat } from "../../hooks/useChat.js";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const chat = useChat();
  const scrollRef = useRef(null);

  const canChat = !chat.disabled && chat.stage !== "form" && chat.stage !== "completed";
  const hasSelectedAction = chat.messages.some(
    (msg) => msg.role === "user" && chat.quickActionLabels.includes(msg.content)
  );
  const backTargetIndex = hasSelectedAction ? chat.messages.reduce((lastIndex, msg, index) => {
    if (msg.role !== "bot" || msg.type === "quickActions" || msg.type === "backActions") {
      return lastIndex;
    }
    return index;
  }, -1) : -1;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.messages, chat.isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || !canChat) return;
    setInput("");
    chat.sendFreeText(text);
  };

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={`z-50 bg-[#f4f1fa] flex flex-col shadow-widget overflow-hidden mx-auto my-8
              ${expanded
                ? "w-full max-w-[860px] h-[min(90vh,calc(100vh-4rem))] rounded-2xl"
                : "w-[92vw] max-w-[420px] max-h-[85vh] rounded-2xl"
              }`}
          >
            <ChatHeader
              expanded={expanded}
              onToggleExpand={() => setExpanded((v) => !v)}
              onClose={() => undefined}
              onNewChat={chat.newChat}
            />

            <div ref={scrollRef} className="flex-1 overflow-y-auto ifhe-scroll px-4 py-4 space-y-3.5">
              {chat.messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  chat={chat}
                  showBack={chat.canGoBack && index === backTargetIndex}
                />
              ))}
              {chat.isTyping && <TypingIndicator />}
            </div>

            <form onSubmit={handleSend} className="shrink-0 border-t border-ifhe-100 bg-white p-3 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={chat.stage === "ask_name" ? "Please enter your name..." : "Ask about programs, admissions, placements..."}
                disabled={!canChat}
                className="flex-1 bg-ifhe-cream/70 rounded-full px-4 py-2.5 text-[13.5px] outline-none focus:ring-2 focus:ring-ifhe-400/40 placeholder:text-ifhe-900/40 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || !canChat}
                className="w-10 h-10 shrink-0 rounded-full bg-ifhe-800 hover:bg-ifhe-900 disabled:opacity-40 text-white flex items-center justify-center transition"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
