"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../hooks/use-media-query";

export function Counter({
  value,
  formatter = (number) => number.toLocaleString(),
  durationMs = 650,
  className = "",
}: {
  value: number;
  formatter?: (value: number) => string;
  durationMs?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const previous = useRef(value);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const from = previous.current;
    const to = value;
    previous.current = value;

    if (!Number.isFinite(to) || durationMs <= 0 || reducedMotion) {
      setShown(to);
      return;
    }

    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(from + (to - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, reducedMotion, value]);

  return <span className={className}>{formatter(shown)}</span>;
}
