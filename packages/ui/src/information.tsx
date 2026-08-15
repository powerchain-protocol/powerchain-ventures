import type {
  ReactNode,
} from "react";
import {
  Badge,
  type BadgeTone,
} from "./badge.js";

export function Information({
  title,
  children,
  tone = "info",
  badge,
  action,
  compact = false,
}: {
  title: string;
  children: ReactNode;
  tone?: BadgeTone;
  badge?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <aside
      className={[
        "pc-information",
        `pc-information-${tone}`,
        compact
          ? "pc-information-compact"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="pc-information-icon"
        aria-hidden="true"
      >
        i
      </div>
      <div className="pc-information-copy">
        <div className="pc-information-title">
          <strong>
            {title}
          </strong>
          {badge ? (
            <Badge tone={tone}>
              {badge}
            </Badge>
          ) : null}
        </div>
        <div className="pc-information-body">
          {children}
        </div>
      </div>
      {action ? (
        <div className="pc-information-action">
          {action}
        </div>
      ) : null}
    </aside>
  );
}
