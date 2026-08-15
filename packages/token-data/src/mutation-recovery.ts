export type MutationRecoveryAction =
  | "none"
  | "takeover"
  | "mark-failed"
  | "reconcile";

export interface MutationRecoveryDecision {
  readonly action: MutationRecoveryAction;
  readonly reason: string;
}

export function decideMutationRecovery(input: {
  state: string;
  leaseExpired: boolean;
  attempt: number;
  maxAttempts: number;
  hasReceipt: boolean;
}): MutationRecoveryDecision {
  if (input.hasReceipt && input.state === "processing") {
    return { action: "reconcile", reason: "receipt exists while mutation is still processing" };
  }
  if (input.state !== "processing") {
    return { action: "none", reason: "mutation is not processing" };
  }
  if (!input.leaseExpired) {
    return { action: "none", reason: "active lease is still valid" };
  }
  if (input.attempt >= input.maxAttempts) {
    return { action: "mark-failed", reason: "maximum recovery attempts reached" };
  }
  return { action: "takeover", reason: "processing lease expired" };
}
