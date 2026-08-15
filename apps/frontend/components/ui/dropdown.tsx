"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export function Dropdown({
  trigger,
  children,
  align = "end",
  label = "Open menu",
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(event: MouseEvent) {
      if (
        !root.current?.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      outside,
    );
    document.addEventListener(
      "keydown",
      keyboard,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        outside,
      );
      document.removeEventListener(
        "keydown",
        keyboard,
      );
    };
  }, []);

  return (
    <div className="pc-dropdown" ref={root}>
      <button
        type="button"
        className="pc-dropdown-trigger"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() =>
          setOpen(value => !value)
        }
      >
        {trigger}
      </button>

      {open ? (
        <div
          className={
            `pc-dropdown-menu pc-dropdown-menu-${align}`
          }
          role="menu"
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function DropdownItem({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="pc-dropdown-item"
      role="none"
    >
      {children}
    </div>
  );
}
