import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function FormField({
  label,
  hint,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const id =
    props.id ?? props.name;

  return (
    <label
      className="pc-field"
      htmlFor={id}
    >
      <span className="pc-field-label">
        {label}
      </span>
      <input
        {...props}
        id={id}
        className={`pc-input ${
          error
            ? "pc-input-error"
            : ""
        }`.trim()}
        aria-invalid={
          Boolean(error)
        }
      />
      {error ? (
        <span className="pc-field-error">
          {error}
        </span>
      ) : hint ? (
        <span className="pc-field-hint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const id =
    props.id ?? props.name;

  return (
    <label
      className="pc-field"
      htmlFor={id}
    >
      <span className="pc-field-label">
        {label}
      </span>
      <textarea
        {...props}
        id={id}
        className={`pc-input pc-textarea ${
          error
            ? "pc-input-error"
            : ""
        }`.trim()}
        aria-invalid={
          Boolean(error)
        }
      />
      {error ? (
        <span className="pc-field-error">
          {error}
        </span>
      ) : hint ? (
        <span className="pc-field-hint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
