import React from "react";
import { GraduationCap, BookOpen, FlaskConical, Award } from "lucide-react";

const LEVELS = [
  { key: "undergraduate", label: "Undergraduate", icon: BookOpen },
  { key: "postgraduate", label: "Postgraduate", icon: GraduationCap },
  { key: "doctoral", label: "Doctoral", icon: FlaskConical },
  { key: "certificate", label: "Certificate", icon: Award },
];

export default function ProgramTypeSelector({ content, onSelect, disabled = false }) {
  return (
    <div className="max-w-[280px] animate-slide-up">
      <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble px-4 py-3 mb-2 text-[14px] text-ifhe-900">
        {content}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {LEVELS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => !disabled && onSelect(key, label)}
            disabled={disabled}
            className="bg-white hover:bg-ifhe-cream border border-ifhe-100 hover:border-ifhe-300 transition rounded-xl p-3 flex flex-col items-start gap-2 text-left shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-ifhe-800/10 text-ifhe-700 flex items-center justify-center">
              <Icon size={16} />
            </div>
            <span className="text-[12.5px] font-semibold text-ifhe-900 leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
