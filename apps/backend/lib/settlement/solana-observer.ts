import type { SolanaTransactionObservation } from "@powerchain/token-data";

export interface SolanaRpcLike {
  getSignatureStatuses(
    signatures: string[],
    config?: { searchTransactionHistory?: boolean },
  ): Promise<{
    value: Array<{
      slot: number;
      confirmations: number | null;
      err: unknown;
      confirmationStatus?: "processed" | "confirmed" | "finalized" | null;
    } | null>;
  }>;
}

export async function observeSolanaTransaction(
  rpc: SolanaRpcLike,
  signature: string,
): Promise<SolanaTransactionObservation> {
  const response = await rpc.getSignatureStatuses(
    [signature],
    { searchTransactionHistory: true },
  );
  const status = response.value[0];
  const observedAt = new Date().toISOString();

  if (!status) {
    return { signature, state: "not-found", observedAt };
  }
  if (status.err) {
    return {
      signature,
      state: "failed",
      slot: status.slot,
      err: status.err,
      observedAt,
    };
  }

  const confirmation = status.confirmationStatus;
  return {
    signature,
    state:
      confirmation === "finalized"
        ? "finalized"
        : confirmation === "confirmed"
          ? "confirmed"
          : "processed",
    slot: status.slot,
    observedAt,
  };
}
