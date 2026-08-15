export type SolanaObservationState =
  | "not-found"
  | "processed"
  | "confirmed"
  | "finalized"
  | "failed";

export interface SolanaTransactionObservation {
  readonly signature: string;
  readonly state: SolanaObservationState;
  readonly slot?: number;
  readonly err?: unknown;
  readonly observedAt: string;
}

export function settlementStateFromObservation(
  state: SolanaObservationState,
): "submitted" | "observed" | "confirmed" | "finalized" | "failed" {
  switch (state) {
    case "processed": return "observed";
    case "confirmed": return "confirmed";
    case "finalized": return "finalized";
    case "failed": return "failed";
    default: return "submitted";
  }
}
