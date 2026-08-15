import {
  normalizeIdempotencyKey,
  requestFingerprint,
} from "@powerchain/token-data";
import { getRuntimePersistence } from "./runtime-persistence";

const TTL_MS = 24 * 60 * 60 * 1000;

export async function resolvePersistentIdempotency(input: {
  keyHeader: string | null;
  method: string;
  path: string;
  body: unknown;
}) {
  const key = normalizeIdempotencyKey(input.keyHeader);
  if (!key) return { kind: "missing" } as const;

  const fingerprint = await requestFingerprint(input.method, input.path, input.body);
  const existing = await getRuntimePersistence().idempotency.read(key);

  if (!existing) {
    return { kind: "new", key, fingerprint } as const;
  }
  if (existing.fingerprint !== fingerprint) {
    return { kind: "conflict", key } as const;
  }
  return {
    kind: "replay",
    key,
    statusCode: existing.statusCode,
    body: existing.body,
  } as const;
}

export async function persistIdempotencyResult(input: {
  key: string;
  fingerprint: string;
  statusCode: number;
  body: unknown;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  return getRuntimePersistence().idempotency.create({
    key: input.key,
    fingerprint: input.fingerprint,
    statusCode: input.statusCode,
    body: input.body,
    expiresAt: new Date(now.getTime() + TTL_MS),
  });
}
