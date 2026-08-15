"use client";

import { useState } from "react";

export function PasswordField({
  value,
  onChange,
  label = "Password",
  autoComplete = "current-password",
  name = "password",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  autoComplete?: string;
  name?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="pc-field">
      <span className="pc-field-label">{label}</span>
      <div className="pc-password-control">
        <input
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={event => onChange(event.target.value)}
          className="pc-input"
          required
          minLength={10}
        />
        <button
          type="button"
          className="pc-password-toggle"
          onClick={() => setVisible(current => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}
