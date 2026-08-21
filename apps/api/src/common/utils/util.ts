export function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
export function nonEmpty(value: string | undefined | null): value is string { return Boolean(value?.trim()); }
export function sleep(ms: number) { return new Promise<void>((resolve) => setTimeout(resolve, ms)); }
export function asError(value: unknown) { return value instanceof Error ? value : new Error(String(value)); }
