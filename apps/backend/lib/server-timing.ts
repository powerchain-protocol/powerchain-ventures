export function timingStart(): () => number {
  const started = performance.now();
  return () => Math.max(0, performance.now() - started);
}

export function serverTimingHeader(name: string, durationMs: number): string {
  const token = name.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 32) || "app";
  return `${token};dur=${durationMs.toFixed(1)}`;
}
