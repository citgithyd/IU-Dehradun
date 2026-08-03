import React from "react";
import { Building2, GraduationCap, Trees, Briefcase, CalendarDays, ExternalLink, MessageCircleQuestion } from "lucide-react";

const ICONS = {
  about_ifhe: Building2,
  programs: GraduationCap,
  campus_life: Trees,
  placements: Briefcase,
  "admissions.calendar": CalendarDays,
  apply_now: ExternalLink,
  ask: MessageCircleQuestion,
};

export default function QuickActionCards({ content, actions, onSelect, disabled = false }) {
  return (
    <div className="max-w-[280px] animate-slide-up">
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = ICONS[action.key] || MessageCircleQuestion;
          return (
            <button
              key={action.key}
              onClick={() => !disabled && onSelect(action.key, action.label)}
              disabled={disabled}
              className="bg-white hover:bg-ifhe-cream border border-ifhe-100 hover:border-ifhe-300 transition rounded-xl p-3 flex flex-col items-start gap-2 text-left shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-ifhe-800/10 text-ifhe-700 flex items-center justify-center">
                <Icon size={16} />
              </div>
              <span className="text-[12.5px] font-semibold text-ifhe-900 leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
