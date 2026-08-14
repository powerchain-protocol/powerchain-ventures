"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
  valid: boolean;
};

function splitCountdown(target: string, now: number): CountdownParts {
  const timestamp = Date.parse(target);
  if (!Number.isFinite(timestamp)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true, valid: false };
  }

  let secondsLeft = Math.max(0, Math.floor((timestamp - now) / 1000));
  const days = Math.floor(secondsLeft / 86_400);
  secondsLeft %= 86_400;
  const hours = Math.floor(secondsLeft / 3_600);
  secondsLeft %= 3_600;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return { days, hours, minutes, seconds, complete: timestamp <= now, valid: true };
}

export function useCountdown(target: string, onComplete?: () => void): CountdownParts {
  const [now, setNow] = useState(() => Date.now());
  const completedRef = useRef(false);
  const state = useMemo(() => splitCountdown(target, now), [target, now]);

  useEffect(() => {
    completedRef.current = false;
    setNow(Date.now());
  }, [target]);

  useEffect(() => {
    if (state.complete) return;
    const id = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(id);
  }, [state.complete, target]);

  useEffect(() => {
    if (!state.complete || completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  }, [onComplete, state.complete]);

  return state;
}
