import React from "react";

export default function KnowMorePrompt({ onKnowMore, disabled = false }) {
  return (
    <div className="max-w-[280px]">
      <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble px-4 py-3 text-[13.5px] text-ifhe-900">
        <p className="text-[13.5px]">Would you like to share a few more details so I can personalize your experience?</p>
        <button
          type="button"
          onClick={() => !disabled && onKnowMore()}
          disabled={disabled}
          className="mt-3 w-full rounded-xl bg-ifhe-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ifhe-900"
        >
          Know more
        </button>
      </div>
    </div>
  );
}
