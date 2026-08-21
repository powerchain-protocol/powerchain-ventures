import * as React from "react";
import { cn } from "../lib/utils";
export function Progress({ value = 0, className, label }: { value?: number; className?: string; label?: string }) {
  const safe = Math.min(100, Math.max(0, value));
  return <div className={cn("ui-progress", className)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe} aria-label={label}><span style={{ width: `${safe}%` }} /></div>;
}
