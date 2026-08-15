"use client";

import type {
  SelectHTMLAttributes,
} from "react";

export type SelectOption<
  T extends string = string,
> = {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function Select<
  T extends string,
>({
  label,
  hint,
  error,
  options,
  value,
  onValueChange,
  className = "",
  ...props
}: Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange"
> & {
  label: string;
  hint?: string;
  error?: string;
  options:
    readonly SelectOption<T>[];
  value: T;
  onValueChange:
    (value: T) => void;
}) {
  const id =
    props.id ?? props.name;

  return (
    <label
      className={`pc-field ${className}`.trim()}
      htmlFor={id}
    >
      <span className="pc-field-label">
        {label}
      </span>
      <div className="pc-select-wrap">
        <select
          {...props}
          id={id}
          value={value}
          onChange={event =>
            onValueChange(
              event.target
                .value as T,
            )
          }
          className={`pc-input pc-select ${
            error
              ? "pc-input-error"
              : ""
          }`.trim()}
          aria-invalid={
            Boolean(error)
          }
        >
          {options.map(
            option => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
                disabled={
                  option.disabled
                }
              >
                {option.label}
              </option>
            ),
          )}
        </select>
        <span
          className="pc-select-chevron"
          aria-hidden="true"
        >
          ⌄
        </span>
      </div>
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
