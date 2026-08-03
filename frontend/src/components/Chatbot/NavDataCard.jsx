import React from "react";
import { CheckCircle2 } from "lucide-react";

function Field({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="mb-2.5 last:mb-0">
      <p className="text-[11px] font-semibold text-ifhe-500 uppercase tracking-wide mb-1">
        {label.replace(/_/g, " ")}
      </p>
      {Array.isArray(value) ? (
        typeof value[0] === "object" ? (
          <div className="space-y-2">
            {value.map((item, i) => (
              <div key={i} className="bg-ifhe-cream/60 rounded-lg p-2.5">
                {Object.entries(item).map(([k, v]) => (
                  <p key={k} className="text-[12.5px] text-ifhe-900/85 leading-snug">
                    <span className="font-semibold">{k.replace(/_/g, " ")}: </span>
                    {Array.isArray(v) ? v.join(", ") : String(v)}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {value.map((v, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12.5px] text-ifhe-900/85">
                <CheckCircle2 size={12} className="mt-0.5 text-ifhe-500 shrink-0" /> {v}
              </li>
            ))}
          </ul>
        )
      ) : typeof value === "object" ? (
        <div className="space-y-1">
          {Object.entries(value).map(([k, v]) => (
            <p key={k} className="text-[12.5px] text-ifhe-900/85">
              <span className="font-semibold">{k.replace(/_/g, " ")}: </span>
              {String(v)}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-[12.5px] text-ifhe-900/85 leading-snug">{String(value)}</p>
      )}
    </div>
  );
}

const TITLES = {
  about_ifhe: "About ICFAI University Dehradun",
  campus_life: "Campus Life",
  placements: "Placements",
  "admissions.calendar": "Admission Calendar",
  "admissions.process": "Admission Process",
  "admissions.eligibility": "Eligibility",
  "admissions.scholarships": "Scholarships",
  "admissions.faqs": "FAQs",
  schools: "Our Schools",
  rankings: "Rankings & Accreditations",
};

export default function NavDataCard({ navKey, data }) {
  return (
    <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble p-4 max-w-[300px] animate-slide-up">
      <p className="font-display font-extrabold text-ifhe-900 text-[15px] mb-2.5">
        {TITLES[navKey] || "Details"}
      </p>
      {Object.entries(data).map(([key, value]) => (
        <Field key={key} label={key} value={value} />
      ))}
    </div>
  );
}
