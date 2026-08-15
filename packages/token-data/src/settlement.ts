export type SettlementState =
  | "created"
  | "submitted"
  | "observed"
  | "confirmed"
  | "finalized"
  | "reconciled"
  | "failed"
  | "manual-review";

export interface SettlementRecord {
  readonly settlementId: string;
  readonly mutationId: string;
  readonly kind: "purchase" | "claim" | "creator";
  readonly state: SettlementState;
  readonly transactionSignature?: string;
  readonly submittedAt?: string;
  readonly observedAt?: string;
  readonly finalizedAt?: string;
  readonly reconciledAt?: string;
  readonly errorCode?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export const FINAL_SETTLEMENT_STATES: readonly SettlementState[] = Object.freeze([
  "reconciled",
  "failed",
  "manual-review",
]);

export function canTransitionSettlement(
  from: SettlementState,
  to: SettlementState,
): boolean {
  const allowed: Record<SettlementState, readonly SettlementState[]> = {
    created: ["submitted", "failed", "manual-review"],
    submitted: ["observed", "confirmed", "finalized", "failed", "manual-review"],
    observed: ["confirmed", "finalized", "failed", "manual-review"],
    confirmed: ["finalized", "failed", "manual-review"],
    finalized: ["reconciled", "manual-review"],
    reconciled: [],
    failed: [],
    "manual-review": ["submitted", "failed"],
  };
  return allowed[from].includes(to);
}
