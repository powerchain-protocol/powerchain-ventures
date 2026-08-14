"use client";

import { useCountdown } from "../../hooks/use-countdown";

export function Countdown({
  target,
  label = "Ends in",
  onComplete,
  className = "",
}: {
  target: string;
  label?: string;
  onComplete?: () => void;
  className?: string;
}) {
  const state = useCountdown(target, onComplete);
  const pad = (value: number) => String(value).padStart(2, "0");

  if (!state.valid) {
    return (
      <div className={`countdown ${className}`} role="status">
        <span>{label}</span>
        <strong>Schedule unavailable</strong>
      </div>
    );
  }

  if (state.complete) {
    return (
      <div className={`countdown ${className}`} role="status">
        <span>{label}</span>
        <strong>00:00:00</strong>
      </div>
    );
  }

  return (
    <div
      className={`countdown ${className}`}
      role="timer"
      aria-live="off"
      aria-label={`${label} ${state.days} days ${state.hours} hours ${state.minutes} minutes ${state.seconds} seconds`}
    >
      <span>{label}</span>
      <div className="countdown-units">
        {state.days > 0 && <b><strong>{state.days}</strong><small>Days</small></b>}
        <b><strong>{pad(state.hours)}</strong><small>Hours</small></b>
        <b><strong>{pad(state.minutes)}</strong><small>Min</small></b>
        <b><strong>{pad(state.seconds)}</strong><small>Sec</small></b>
      </div>
    </div>
  );
}
