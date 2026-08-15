import {
  POWERCHAIN_MUTATION_LEASE,
  requestFingerprint,
  type MutationKind,
  type MutationReceipt,
} from "@powerchain/token-data";
import { executeIdempotentMutation } from "./mutation-executor";
import { getRuntimePersistence } from "./runtime-persistence";

function mutationIdFromFingerprint(fingerprint: string): string {
  return `mut_${fingerprint.slice(0, 32)}`;
}

function ownerId(requestId: string): string {
  return `owner_${requestId.slice(0, 48)}`;
}

export async function orchestrateMutation<T>(input: {
  requestId: string;
  method: string;
  path: string;
  body: unknown;
  idempotencyKeyHeader: string | null;
  kind: MutationKind;
  execute: () => Promise<{ statusCode: number; body: T }>;
}): Promise<
  | { kind: "idempotency-required" }
  | { kind: "idempotency-conflict" }
  | { kind: "in-progress" }
  | { kind: "receipt"; receipt: MutationReceipt<T> }
> {
  const fingerprint = await requestFingerprint(input.method, input.path, input.body);
  const mutationId = mutationIdFromFingerprint(fingerprint);
  const persistence = getRuntimePersistence();
  const existingReceipt = await persistence.mutationReceipts.read(mutationId);

  if (existingReceipt && (
    existingReceipt.state === "succeeded"
    || existingReceipt.state === "failed"
    || existingReceipt.state === "replayed"
  )) {
    return {
      kind: "receipt",
      receipt: {
        ...existingReceipt,
        state: "replayed",
        replayed: true,
      } as MutationReceipt<T>,
    };
  }

  const owner = ownerId(input.requestId);
  const lease = await persistence.mutationLeases.acquire({
    mutationId,
    ownerId: owner,
    leaseExpiresAt: new Date(Date.now() + POWERCHAIN_MUTATION_LEASE.leaseMs),
  });

  if (lease.kind === "busy") {
    return { kind: "in-progress" };
  }

  if (lease.lease.attempt > POWERCHAIN_MUTATION_LEASE.maxAttempts) {
    await persistence.mutationLeases.fail({ mutationId, ownerId: owner });
    await persistence.mutationReceipts.update(mutationId, {
      state: "failed",
      statusCode: 500,
      errorCode: "MUTATION_RECOVERY_EXHAUSTED",
      updatedAt: new Date().toISOString(),
    }).catch(() => {});
    return {
      kind: "receipt",
      receipt: {
        mutationId,
        requestId: input.requestId,
        kind: input.kind,
        state: "failed",
        statusCode: 500,
        replayed: false,
        createdAt: existingReceipt?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        errorCode: "MUTATION_RECOVERY_EXHAUSTED",
      },
    };
  }

  const now = new Date().toISOString();
  if (!existingReceipt) {
    await persistence.mutationReceipts.create({
      mutationId,
      requestId: input.requestId,
      kind: input.kind,
      state: "processing",
      statusCode: 202,
      replayed: false,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await persistence.mutationReceipts.update(mutationId, {
      state: "processing",
      statusCode: 202,
      updatedAt: now,
    });
  }

  const heartbeat = setInterval(() => {
    void persistence.mutationLeases.heartbeat({
      mutationId,
      ownerId: owner,
      leaseExpiresAt: new Date(Date.now() + POWERCHAIN_MUTATION_LEASE.leaseMs),
    });
  }, POWERCHAIN_MUTATION_LEASE.heartbeatMs);

  try {
    const result = await executeIdempotentMutation<T>({
      requestId: input.requestId,
      method: input.method,
      path: input.path,
      body: input.body,
      idempotencyKeyHeader: input.idempotencyKeyHeader,
      kind: input.kind,
      execute: input.execute,
    });

    if (result.kind !== "result") return result;

    const receipt: MutationReceipt<T> = {
      mutationId,
      requestId: input.requestId,
      kind: input.kind,
      state: result.value.statusCode >= 200 && result.value.statusCode < 300
        ? (result.value.replayed ? "replayed" : "succeeded")
        : "failed",
      statusCode: result.value.statusCode,
      replayed: result.value.replayed,
      createdAt: existingReceipt?.createdAt ?? now,
      updatedAt: new Date().toISOString(),
      result: result.value.body,
    };

    await persistence.mutationReceipts.update(mutationId, {
      state: receipt.state,
      statusCode: receipt.statusCode,
      updatedAt: receipt.updatedAt,
      result: receipt.result,
      replayed: receipt.replayed,
    });

    if (receipt.state === "failed") {
      await persistence.mutationLeases.fail({ mutationId, ownerId: owner });
    } else {
      await persistence.mutationLeases.complete({ mutationId, ownerId: owner });
    }

    return { kind: "receipt", receipt };
  } catch (error) {
    await persistence.mutationLeases.fail({ mutationId, ownerId: owner });
    await persistence.mutationReceipts.update(mutationId, {
      state: "failed",
      statusCode: 500,
      errorCode: "MUTATION_FAILED",
      updatedAt: new Date().toISOString(),
    }).catch(() => {});
    throw error;
  } finally {
    clearInterval(heartbeat);
  }
}
