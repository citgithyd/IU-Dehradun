import React from "react";

export default function FollowUpSuggestions({ suggestions = [], onPick, showBack = false, onBack, disabled = false }) {
  if (!suggestions.length && !showBack) return null;
  return (
    <div className="mt-2 max-w-[300px] animate-slide-up">
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => !disabled && onPick(s.query)}
            disabled={disabled}
            className="text-[12px] font-medium bg-white hover:bg-ifhe-cream border border-ifhe-200 text-ifhe-700 rounded-full px-3 py-1.5 transition"
          >
            {s.label}
          </button>
        ))}
        {showBack && (
          <button
            type="button"
            onClick={() => !disabled && onBack()}
            disabled={disabled}
            className="text-[12px] font-medium bg-white hover:bg-ifhe-cream border border-ifhe-200 text-ifhe-700 rounded-full px-3 py-1.5 transition"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}
