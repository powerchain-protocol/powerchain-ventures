import {
  POWERCHAIN_MUTATION_LEASE,
  decideMutationRecovery,
} from "@powerchain/token-data";
import { getRuntimePersistence } from "./runtime-persistence";

export async function inspectMutationForRecovery(mutationId: string) {
  const persistence = getRuntimePersistence();
  const receipt = await persistence.mutationReceipts.read(mutationId);
  const lease = await persistence.mutationLeases.read(mutationId);

  if (!receipt) {
    return {
      mutationId,
      action: "none" as const,
      reason: "no mutation receipt",
    };
  }

  const decision = decideMutationRecovery({
    state: receipt.state,
    leaseExpired: !lease || Date.parse(lease.leaseExpiresAt) <= Date.now(),
    attempt: lease?.attempt ?? 0,
    maxAttempts: POWERCHAIN_MUTATION_LEASE.maxAttempts,
    hasReceipt: Boolean(receipt.result),
  });

  return {
    mutationId,
    receipt,
    lease,
    ...decision,
  };
}

export async function reconcileMutationReceipt(mutationId: string): Promise<void> {
  const persistence = getRuntimePersistence();
  const receipt = await persistence.mutationReceipts.read(mutationId);
  if (!receipt || receipt.state !== "processing") return;

  if (receipt.result !== undefined) {
    await persistence.mutationReceipts.update(mutationId, {
      state: receipt.statusCode >= 200 && receipt.statusCode < 300 ? "succeeded" : "failed",
      updatedAt: new Date().toISOString(),
    });
  }
}
