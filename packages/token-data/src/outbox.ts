export type OutboxEventType =
  | "settlement.observe"
  | "settlement.reconcile"
  | "mutation.audit"
  | "receipt.refresh";

export interface OutboxEvent<T = unknown> {
  readonly eventId: string;
  readonly type: OutboxEventType;
  readonly aggregateId: string;
  readonly payload: T;
  readonly attempts: number;
  readonly availableAt: string;
  readonly createdAt: string;
}
