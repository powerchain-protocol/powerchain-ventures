"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ClipboardStatus = "idle" | "copied" | "error";

/** Copy text without throwing into UI event handlers and reset feedback automatically. */
export function useCopyToClipboard(resetAfterMs = 1800) {
  const [status, setStatus] = useState<ClipboardStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const copy = useCallback(async (value: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    timeoutRef.current = setTimeout(() => setStatus("idle"), resetAfterMs);
  }, [resetAfterMs]);

  return { copy, status } as const;
}
