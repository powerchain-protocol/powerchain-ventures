import type {
  ReactNode,
} from "react";

export type BadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "dark";

export function Badge({
  tone = "neutral",
  children,
  dot = false,
  className = "",
}: {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`pc-badge pc-badge-${tone} ${className}`.trim()}
    >
      {dot ? (
        <span
          className="pc-badge-dot"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  );
}
