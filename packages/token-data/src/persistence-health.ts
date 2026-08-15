export interface RuntimePersistenceHealth {
  readonly mode:
    | "memory"
    | "database";
  readonly rateLimitReady: boolean;
  readonly idempotencyReady: boolean;
  readonly auditReady: boolean;
  readonly atomicIdempotencyReady: boolean;
  readonly mutationReceiptsReady: boolean;
  readonly settlementsReady: boolean;
  readonly outboxReady: boolean;
  readonly outbox: {
    readonly pending: number;
    readonly processing: number;
    readonly failed: number;
    readonly expiredLeases: number;
    readonly maxAttempts: number;
    readonly oldestPendingAt?: string;
  } | null;
  readonly ready: boolean;
  readonly checkedAt: string;
  readonly errors:
    readonly string[];
}
