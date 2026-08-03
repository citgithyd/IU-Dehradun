import React from "react";
import { Clock, CheckCircle2, ListChecks, Briefcase, FileText, ExternalLink, Sparkles } from "lucide-react";

function Row({ icon: Icon, label, children }) {
  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ifhe-500 uppercase tracking-wide mb-1">
        <Icon size={12} /> {label}
      </div>
      <div className="text-[13px] text-ifhe-900/85 leading-snug">{children}</div>
    </div>
  );
}

export default function CourseDetail({ program, onAskAi, disabled = false }) {
  return (
    <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble p-4 max-w-[300px] animate-slide-up">
      <p className="text-[11px] font-semibold text-ifhe-500 uppercase tracking-wide mb-0.5">{program.school}</p>
      <p className="font-display font-extrabold text-ifhe-900 text-[16px] leading-snug mb-2.5">{program.name}</p>

      <Row icon={FileText} label="Overview">{program.overview}</Row>
      <Row icon={Clock} label="Duration">{program.duration}</Row>
      <Row icon={CheckCircle2} label="Eligibility">{program.eligibility}</Row>

      {program.curriculum_highlights?.length > 0 && (
        <Row icon={ListChecks} label="Curriculum Highlights">
          <ul className="list-disc ml-4 space-y-0.5">
            {program.curriculum_highlights.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </Row>
      )}

      {program.career_opportunities?.length > 0 && (
        <Row icon={Briefcase} label="Career Opportunities">
          {program.career_opportunities.join(", ")}
        </Row>
      )}

      <Row icon={FileText} label="Admission Process">{program.admission_process}</Row>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => !disabled && onAskAi(program, true)}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1 bg-ifhe-800 hover:bg-ifhe-900 transition text-white text-[12.5px] font-semibold rounded-lg py-2"
        >
          Apply Now <ExternalLink size={13} />
        </button>
        <button
          onClick={() => !disabled && onAskAi(program)}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1 bg-ifhe-cream hover:bg-ifhe-100 border border-ifhe-200 transition text-ifhe-800 text-[12.5px] font-semibold rounded-lg py-2"
        >
          <Sparkles size={13} /> Ask AI
        </button>
      </div>
    </div>
  );
}
