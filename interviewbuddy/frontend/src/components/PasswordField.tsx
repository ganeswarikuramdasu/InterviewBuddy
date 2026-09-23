import React, { useState } from "react";

const PasswordField: React.FC<{
  id: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}> = ({ id, value, placeholder, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      {" "}
      <input
        id={id}
        type={show ? "text" : "password"}
        required
        className="input pr-11"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />{" "}
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 text-sm font-medium"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {" "}
        {show ? "Hide" : "\u{1F441}"}{" "}
      </button>{" "}
    </div>
  );
};

export default PasswordField;
