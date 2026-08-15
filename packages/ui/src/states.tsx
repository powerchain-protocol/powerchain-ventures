import type {
  ReactNode,
} from "react";

export function LoadingState({
  label = "Loading…",
}: {
  label?: string;
}) {
  return (
    <div
      className="pc-state pc-state-loading"
      role="status"
      aria-live="polite"
    >
      <span
        className="pc-state-spinner"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="pc-state pc-state-empty">
      <strong>{title}</strong>
      {description ? (
        <p>{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="pc-state pc-state-error"
      role="alert"
    >
      <strong>{title}</strong>
      {description ? (
        <p>{description}</p>
      ) : null}
      {action}
    </div>
  );
}
