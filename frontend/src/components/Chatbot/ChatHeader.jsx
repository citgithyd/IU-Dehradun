import React from "react";
import { ChevronLeft, Maximize2, Minimize2, X, MoreVertical, RotateCcw } from "lucide-react";

export default function ChatHeader({ expanded, onToggleExpand, onClose, onNewChat }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-ifhe-900 to-ifhe-700 text-white rounded-t-2xl shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="md:hidden w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          aria-label="Back"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-display font-extrabold text-ifhe-800 text-sm shrink-0">
          IF
        </div>
        <div>
          <p className="font-display font-bold leading-tight text-[15px]">ICFAI University Dehradun Assistant</p>
          <p className="text-[11px] text-white/70 leading-tight flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Online now
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          aria-label="More options"
        >
          <MoreVertical size={17} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-9 bg-white text-ifhe-900 rounded-xl shadow-widget py-1 w-40 z-10 text-sm overflow-hidden">
            <button
              onClick={() => {
                onNewChat();
                setMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 hover:bg-ifhe-cream flex items-center gap-2"
            >
              <RotateCcw size={14} /> New Chat
            </button>
          </div>
        )}
        <button
          onClick={onToggleExpand}
          className="hidden md:flex w-8 h-8 items-center justify-center rounded-full hover:bg-white/10 transition"
          aria-label={expanded ? "Minimize" : "Maximize"}
        >
          {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}
