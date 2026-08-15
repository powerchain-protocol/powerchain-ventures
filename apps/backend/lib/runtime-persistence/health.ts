import type {
  RuntimePersistenceHealth,
} from "@powerchain/token-data";
import {
  getRuntimePersistence,
} from "./index";

export async function checkRuntimePersistenceHealth():
  Promise<RuntimePersistenceHealth> {
  const persistence =
    getRuntimePersistence();
  const errors: string[] = [];

  let rateLimitReady = false;
  let idempotencyReady = false;
  let auditReady = false;
  let atomicIdempotencyReady = false;
  let mutationReceiptsReady = false;
  let settlementsReady = false;
  let outboxReady = false;
  let outbox:
    RuntimePersistenceHealth["outbox"] =
    null;

  try {
    const result =
      await persistence.rateLimit.consume(
        {
          bucket:
            "__health__",
          identityHash:
            "health",
          limit: 1000,
          windowSeconds: 60,
          now: new Date(),
        },
      );

    rateLimitReady =
      typeof result.allowed ===
      "boolean";
  } catch (error) {
    errors.push(
      `rate-limit persistence: ${
        error instanceof Error
          ? error.message
          : "failed"
      }`,
    );
  }

  try {
    await persistence.idempotency.read(
      "__powerchain_health__",
    );
    idempotencyReady = true;
  } catch (error) {
    errors.push(
      `idempotency persistence: ${
        error instanceof Error
          ? error.message
          : "failed"
      }`,
    );
  }

  try {
    await persistence.atomicIdempotency.read(
      "__powerchain_health__",
    );
    atomicIdempotencyReady = true;
  } catch (error) {
    errors.push(
      `atomic idempotency persistence: ${
        error instanceof Error
          ? error.message
          : "failed"
      }`,
    );
  }

  try {
    await persistence.mutationReceipts.read(
      "mut_00000000000000000000000000000000",
    );
    mutationReceiptsReady = true;
  } catch (error) {
    errors.push(
      `mutation receipt persistence: ${
        error instanceof Error
          ? error.message
          : "failed"
      }`,
    );
  }

  try {
    await persistence.settlements.read(
      "set_00000000000000000000000000000000",
    );
    settlementsReady = true;
  } catch (error) {
    errors.push(
      `settlement persistence: ${
        error instanceof Error
          ? error.message
          : "failed"
      }`,
    );
  }

  try {
    const stats =
      await persistence.outbox.stats(
        new Date(),
      );

    outboxReady = true;
    outbox = {
      pending:
        stats.pending,
      processing:
        stats.processing,
      failed:
        stats.failed,
      expiredLeases:
        stats.expiredLeases,
      maxAttempts:
        stats.maxAttempts,
      oldestPendingAt:
        stats.oldestPendingAt,
    };
  } catch (error) {
    errors.push(
      `outbox persistence: ${
        error instanceof Error
          ? error.message
          : "failed"
      }`,
    );
  }

  try {
    await persistence.audit.append(
      {
        event:
          "runtime_persistence_health",
        code:
          "HEALTH_CHECK",
        occurredAt:
          new Date(),
      },
    );
    auditReady = true;
  } catch (error) {
    errors.push(
      `audit persistence: ${
        error instanceof Error
          ? error.message
          : "failed"
      }`,
    );
  }

  const ready =
    rateLimitReady &&
    idempotencyReady &&
    atomicIdempotencyReady &&
    mutationReceiptsReady &&
    settlementsReady &&
    outboxReady &&
    auditReady;

  return {
    mode:
      persistence.mode,
    rateLimitReady,
    idempotencyReady,
    auditReady,
    atomicIdempotencyReady,
    mutationReceiptsReady,
    settlementsReady,
    outboxReady,
    outbox,
    ready,
    checkedAt:
      new Date().toISOString(),
    errors,
  };
}
