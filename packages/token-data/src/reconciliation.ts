export type ReconciliationDecision =
  | "wait"
  | "finalize"
  | "fail"
  | "manual-review";

export function decideReconciliation(input: {
  settlementState: string;
  observationState: string;
  attempts: number;
  maxAttempts: number;
  ageMs: number;
  maxAgeMs: number;
}): { decision: ReconciliationDecision; reason: string } {
  if (input.observationState === "failed") {
    return { decision: "fail", reason: "chain transaction failed" };
  }
  if (input.observationState === "finalized") {
    return { decision: "finalize", reason: "chain transaction finalized" };
  }
  if (input.attempts >= input.maxAttempts || input.ageMs >= input.maxAgeMs) {
    return { decision: "manual-review", reason: "reconciliation bounds exhausted" };
  }
  return { decision: "wait", reason: "awaiting finality" };
}

export const POWERCHAIN_RECONCILIATION_POLICY = Object.freeze({
  pollIntervalMs: 5_000,
  maxAttempts: 120,
  maxAgeMs: 15 * 60 * 1000,
});
