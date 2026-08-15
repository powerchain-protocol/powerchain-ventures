"use client";

import type {
  ReactNode,
} from "react";

export type TabItem<
  T extends string,
> = {
  value: T;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
};

export function Tabs<
  T extends string,
>({
  value,
  onChange,
  items,
  ariaLabel,
  icons,
  variant = "default",
}: {
  value: T;
  onChange: (value: T) => void;
  items: readonly TabItem<T>[];
  ariaLabel: string;
  icons?: Partial<
    Record<T, ReactNode>
  >;
  variant?:
    | "default"
    | "cards";
}) {
  return (
    <div
      className={`pc-tabs pc-tabs-${variant}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map(item => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={
            value === item.value
          }
          disabled={item.disabled}
          className="pc-tab"
          onClick={() =>
            onChange(
              item.value,
            )
          }
        >
          {icons?.[item.value] ? (
            <span className="pc-tab-icon">
              {
                icons[
                  item.value
                ]
              }
            </span>
          ) : null}
          <span className="pc-tab-copy">
            <strong>
              {item.label}
            </strong>
            {item.description ? (
              <small>
                {
                  item.description
                }
              </small>
            ) : null}
          </span>
          {item.badge ? (
            <em>{item.badge}</em>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <section
      id={`tab-panel-${value}`}
      role="tabpanel"
      className="pc-tab-panel"
    >
      {children}
    </section>
  );
}
