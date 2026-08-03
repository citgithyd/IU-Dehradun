import React from "react";
import { Phone, Mail, Clock } from "lucide-react";

export default function LeadCapturePrompt({ onRespond, disabled = false }) {
  return (
    <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble p-4 max-w-[280px] animate-slide-up border border-ifhe-gold/30">
      <p className="text-[13.5px] text-ifhe-900 font-medium mb-3">
        Would you like an Admission Counsellor to contact you personally? 🎓
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => !disabled && onRespond("yes")}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 bg-ifhe-800 hover:bg-ifhe-900 transition text-white text-[12.5px] font-semibold rounded-lg py-2"
        >
          <Phone size={13} /> Yes, Call Me
        </button>
        <button
          onClick={() => !disabled && onRespond("email")}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 bg-ifhe-cream hover:bg-ifhe-100 border border-ifhe-200 transition text-ifhe-800 text-[12.5px] font-semibold rounded-lg py-2"
        >
          <Mail size={13} /> Email Me
        </button>
      </div>
      <button
        onClick={() => !disabled && onRespond("not_now")}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-1.5 text-ifhe-900/50 hover:text-ifhe-900/80 transition text-[12px] font-medium mt-2 py-1"
      >
        <Clock size={12} /> Not Now
      </button>
    </div>
  );
}
