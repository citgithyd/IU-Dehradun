import React from "react";
import { BookOpen, ChevronRight } from "lucide-react";

export default function ProgramGroupSelector({ content, groups, onSelect, disabled = false }) {
  if (!groups.length) {
    return (
      <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble px-4 py-3 max-w-[280px] text-sm text-ifhe-900/70 animate-slide-up">
        No program groups found for this level yet.
      </div>
    );
  }

  return (
    <div className="max-w-[290px] animate-slide-up">
      {content && (
        <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble px-4 py-3 mb-2 text-[14px] text-ifhe-900">
          {content}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {groups.map((group) => (
          <button
            key={group.label}
            onClick={() => !disabled && onSelect(group)}
            disabled={disabled}
            className="bg-white hover:bg-ifhe-cream border border-ifhe-100 hover:border-ifhe-300 transition rounded-xl p-3 flex flex-col items-start gap-2 text-left shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-ifhe-800/10 text-ifhe-700 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <span className="text-[12.5px] font-semibold text-ifhe-900 leading-tight">{group.label}</span>
            <span className="mt-auto inline-flex items-center gap-0.5 text-[11px] text-ifhe-900/55">
              {group.programs.length} {group.programs.length === 1 ? "course" : "courses"} <ChevronRight size={12} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
