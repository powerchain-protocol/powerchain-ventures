import type {
  ReactNode,
} from "react";

export type AlarmTone =
  | "info"
  | "success"
  | "warning"
  | "danger";

export function Alarm({
  tone = "info",
  title,
  children,
  action,
}: {
  tone?: AlarmTone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  const icon =
    tone === "success"
      ? "✓"
      : tone === "warning"
        ? "!"
        : tone === "danger"
          ? "×"
          : "i";

  return (
    <div
      className={`pc-alarm pc-alarm-${tone}`}
      role={
        tone === "danger"
          ? "alert"
          : "status"
      }
    >
      <span
        className="pc-alarm-icon"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="pc-alarm-copy">
        <strong>
          {title}
        </strong>
        {children ? (
          <div>
            {children}
          </div>
        ) : null}
      </div>
      {action ? (
        <div className="pc-alarm-action">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export function AlarmStack({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="pc-alarm-stack">
      {children}
    </div>
  );
}
