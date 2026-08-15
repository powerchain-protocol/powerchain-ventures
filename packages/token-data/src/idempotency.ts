export type IdempotencyStatus = "new" | "replayed" | "conflict";

export interface IdempotencyRecord<T = unknown> {
  readonly key: string;
  readonly fingerprint: string;
  readonly status: IdempotencyStatus;
  readonly response?: T;
}

export function normalizeIdempotencyKey(value: string | null | undefined): string | null {
  const key = value?.trim() ?? "";
  if (!key) return null;
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(key)) return null;
  return key;
}
