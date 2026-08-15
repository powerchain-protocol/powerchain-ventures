export type MutationLeaseState =
  | "active"
  | "expired"
  | "completed"
  | "failed";

export interface MutationLease {
  readonly mutationId: string;
  readonly ownerId: string;
  readonly state: MutationLeaseState;
  readonly leaseExpiresAt: string;
  readonly heartbeatAt: string;
  readonly attempt: number;
}

export const POWERCHAIN_MUTATION_LEASE = Object.freeze({
  leaseMs: 30_000,
  heartbeatMs: 10_000,
  maxAttempts: 3,
});
