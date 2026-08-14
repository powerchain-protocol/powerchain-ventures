"use client";

import { useEffect, type RefObject } from "react";

/** Close popovers/menus when focus or pointer activity moves outside the owning element. */
export function useClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, onOutside: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (event: PointerEvent) => {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) onOutside();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOutside();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled, onOutside, ref]);
}
