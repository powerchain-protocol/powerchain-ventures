export type SolanaSettlementState =
  | "not-found"
  | "processed"
  | "confirmed"
  | "finalized"
  | "failed";

export type SignatureStatusLike = {
  slot: number;
  confirmations:
    number | null;
  err: unknown;
  confirmationStatus?:
    | "processed"
    | "confirmed"
    | "finalized"
    | null;
};

export function settlementStateFromSignatureStatus(
  status:
    SignatureStatusLike | null,
): SolanaSettlementState {
  if (!status) {
    return "not-found";
  }

  if (status.err) {
    return "failed";
  }

  if (
    status.confirmationStatus ===
      "finalized" ||
    (
      status.confirmations ===
        null &&
      status.confirmationStatus !==
        "processed"
    )
  ) {
    return "finalized";
  }

  if (
    status.confirmationStatus ===
    "confirmed"
  ) {
    return "confirmed";
  }

  return "processed";
}

export function isFinalSolanaSettlement(
  state:
    SolanaSettlementState,
) {
  return state ===
    "finalized" ||
    state ===
      "failed";
}
