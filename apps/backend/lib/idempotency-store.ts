import { normalizeIdempotencyKey } from "@powerchain/token-data";

type Stored = {
  fingerprint: string;
  statusCode: number;
  body: unknown;
  expiresAt: number;
};

const store = new Map<string, Stored>();
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_KEYS = 20_000;

function prune(now: number) {
  for (const [key, value] of store) {
    if (value.expiresAt <= now) store.delete(key);
  }
  while (store.size > MAX_KEYS) {
    const first = store.keys().next().value;
    if (!first) break;
    store.delete(first);
  }
}

export function readIdempotency(
  keyHeader: string | null,
  fingerprint: string,
  now = Date.now(),
):
  | { kind: "missing" }
  | { kind: "new"; key: string }
  | { kind: "replay"; response: Stored }
  | { kind: "conflict" } {
  const key = normalizeIdempotencyKey(keyHeader);
  if (!key) return { kind: "missing" };

  prune(now);
  const existing = store.get(key);
  if (!existing) return { kind: "new", key };
  if (existing.fingerprint !== fingerprint) return { kind: "conflict" };
  return { kind: "replay", response: existing };
}

export function writeIdempotency(
  key: string,
  fingerprint: string,
  statusCode: number,
  body: unknown,
  now = Date.now(),
): void {
  store.set(key, {
    fingerprint,
    statusCode,
    body,
    expiresAt: now + TTL_MS,
  });
  prune(now);
}
