import React from "react";
import { Clock, CheckCircle2, ChevronRight } from "lucide-react";

export default function CourseList({ level, programs, onSelectCourse, disabled = false }) {
  if (!programs.length) {
    return (
      <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble px-4 py-3 max-w-[280px] text-sm text-ifhe-900/70 animate-slide-up">
        No programs found for this level yet.
      </div>
    );
  }

  return (
    <div className="max-w-[290px] space-y-2 animate-slide-up">
      {programs.map((program) => (
        <div key={program.id} className="bg-white rounded-xl shadow-bubble p-3.5 border border-ifhe-100/70">
          <p className="text-[11px] font-semibold text-ifhe-500 uppercase tracking-wide mb-0.5">{program.school}</p>
          <p className="font-display font-bold text-ifhe-900 text-[14.5px] leading-snug mb-1.5">{program.name}</p>
          <div className="flex items-center gap-1.5 text-[12px] text-ifhe-900/60 mb-1">
            <Clock size={12} /> {program.duration}
          </div>
          <div className="flex items-start gap-1.5 text-[12px] text-ifhe-900/60 mb-3">
            <CheckCircle2 size={12} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{program.eligibility}</span>
          </div>
          <button
            onClick={() => !disabled && onSelectCourse(level, program)}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-1 bg-ifhe-800 hover:bg-ifhe-900 transition text-white text-[12.5px] font-semibold rounded-lg py-2"
          >
            Read More <ChevronRight size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
