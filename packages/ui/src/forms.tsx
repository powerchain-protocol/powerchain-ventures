import type {
  FormHTMLAttributes,
  ReactNode,
} from "react";

export function Form({
  children,
  className = "",
  ...props
}: FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
}) {
  return (
    <form
      {...props}
      className={`pc-form ${className}`.trim()}
    >
      {children}
    </form>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="pc-form-section">
      {title || description ? (
        <header className="pc-form-section-header">
          {title ? (
            <h3>{title}</h3>
          ) : null}
          {description ? (
            <p>{description}</p>
          ) : null}
        </header>
      ) : null}
      <div className="pc-form-section-body">
        {children}
      </div>
    </section>
  );
}

export function FieldGroup({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}) {
  return (
    <div
      className="pc-field-group"
      data-columns={columns}
    >
      {children}
    </div>
  );
}

export function FormActions({
  children,
  sticky = false,
}: {
  children: ReactNode;
  sticky?: boolean;
}) {
  return (
    <div
      className={`pc-form-actions ${
        sticky
          ? "pc-form-actions-sticky"
          : ""
      }`.trim()}
    >
      {children}
    </div>
  );
}
