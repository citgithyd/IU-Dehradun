import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Landmark } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;

const FIELDS = [
  { name: "name", label: "Name", icon: User, type: "text" },
  { name: "email", label: "Email", icon: Mail, type: "email" },
  { name: "phone", label: "Phone Number", icon: Phone, type: "tel" },
  { name: "city", label: "City", icon: MapPin, type: "text" },
  { name: "state", label: "State", icon: Landmark, type: "text" },
];

export default function UserDetailsForm({ onSubmit }) {
  const [values, setValues] = useState({ name: "", email: "", phone: "", city: "", state: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    Object.entries(values).forEach(([key, val]) => {
      if (!val.trim()) errs[key] = "Required";
    });
    if (values.email && !EMAIL_RE.test(values.email.trim())) errs.email = "Invalid email";
    if (values.phone && !PHONE_RE.test(values.phone.replace(/[\s\-\.\(\)]/g, ""))) errs.phone = "Invalid phone";
    return errs;
  };

  const handleChange = (name, val) => {
    setValues((v) => ({ ...v, [name]: val }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    const cleanedValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
    };
    await onSubmit(cleanedValues);
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl rounded-bl-sm shadow-bubble p-4 w-full max-w-[280px] animate-slide-up">
      <p className="text-[13px] text-ifhe-900/70 font-medium mb-3">Please fill your details to get started</p>
      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        {FIELDS.map(({ name, label, icon: Icon, type }) => (
          <div key={name}>
            <div
              className={`flex items-center gap-2 bg-ifhe-cream/70 border rounded-xl px-3 py-2 transition ${
                errors[name] ? "border-red-400" : "border-transparent focus-within:border-ifhe-400"
              }`}
            >
              <Icon size={15} className="text-ifhe-500 shrink-0" />
              <input
                type={type}
                placeholder={label}
                value={values[name]}
                onChange={(e) => handleChange(name, e.target.value)}
                className="bg-transparent text-sm w-full outline-none placeholder:text-ifhe-900/40"
              />
            </div>
            {errors[name] && <p className="text-[11px] text-red-500 mt-0.5 ml-1">{errors[name]}</p>}
          </div>
        ))}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ifhe-800 hover:bg-ifhe-900 transition text-white text-sm font-semibold rounded-xl py-2.5 mt-1 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
