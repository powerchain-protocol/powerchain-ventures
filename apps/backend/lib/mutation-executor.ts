import {
  normalizeIdempotencyKey,
  requestFingerprint,
  type MutationKind,
  type MutationResult,
} from "@powerchain/token-data";
import { getRuntimePersistence } from "./runtime-persistence";
import { writeAuditEvent } from "./audit-log";

const TTL_MS = 24 * 60 * 60 * 1000;

export async function executeIdempotentMutation<T>(input: {
  requestId: string;
  method: string;
  path: string;
  body: unknown;
  idempotencyKeyHeader: string | null;
  kind: MutationKind;
  execute: () => Promise<{ statusCode: number; body: T }>;
}): Promise<
  | { kind: "result"; value: MutationResult<T> }
  | { kind: "idempotency-required" }
  | { kind: "idempotency-conflict" }
  | { kind: "in-progress" }
> {
  const key = normalizeIdempotencyKey(input.idempotencyKeyHeader);
  if (!key) return { kind: "idempotency-required" };

  const fingerprint = await requestFingerprint(input.method, input.path, input.body);
  const persistence = getRuntimePersistence();

  const reservation = await persistence.atomicIdempotency.reserve({
    key,
    fingerprint,
    expiresAt: new Date(Date.now() + TTL_MS),
  });

  if (reservation.kind === "existing") {
    const existing = reservation.value;

    if (existing.fingerprint !== fingerprint) {
      await writeAuditEvent("idempotency_conflict", {
        requestId: input.requestId,
        route: input.path,
        status: 409,
        code: "IDEMPOTENCY_CONFLICT",
        metadata: { kind: input.kind },
      });
      return { kind: "idempotency-conflict" };
    }

    if (existing.state === "reserved") {
      return { kind: "in-progress" };
    }

    return {
      kind: "result",
      value: {
        statusCode: existing.statusCode ?? 500,
        body: existing.body as T,
        replayed: true,
      },
    };
  }

  try {
    const executed = await input.execute();
    await persistence.atomicIdempotency.complete({
      key,
      fingerprint,
      statusCode: executed.statusCode,
      body: executed.body,
    });

    return {
      kind: "result",
      value: {
        statusCode: executed.statusCode,
        body: executed.body,
        replayed: false,
      },
    };
  } catch (error) {
    const body = {
      error: {
        code: "MUTATION_FAILED",
        message: error instanceof Error ? error.message : "Mutation failed",
      },
    };

    await persistence.atomicIdempotency.fail({
      key,
      fingerprint,
      statusCode: 500,
      body,
    });

    throw error;
  }
}
