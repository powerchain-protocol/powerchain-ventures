import type { SettlementRecord, SettlementState } from "./settlement.js";
import type { OutboxEvent } from "./outbox.js";

export interface SettlementPersistence {
  read(settlementId: string): Promise<SettlementRecord | null>;
  findByMutationId(mutationId: string): Promise<SettlementRecord | null>;
  create(record: SettlementRecord): Promise<"created" | "exists">;
  transition(input: {
    settlementId: string;
    expectedState: SettlementState;
    nextState: SettlementState;
    transactionSignature?: string;
    errorCode?: string;
    observedAt?: string;
    finalizedAt?: string;
    reconciledAt?: string;
    updatedAt: string;
  }): Promise<boolean>;
}

export type OutboxStats = {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  expiredLeases: number;
  maxAttempts: number;
  oldestPendingAt?: string;
};

export interface OutboxPersistence {
  enqueue(event: OutboxEvent): Promise<"created" | "exists">;
  claim(limit: number, ownerId: string, leaseUntil: Date): Promise<OutboxEvent[]>;
  complete(eventId: string, ownerId: string): Promise<void>;
  retry(
    eventId: string,
    ownerId: string,
    availableAt: Date,
    errorCode?: string,
  ): Promise<void>;
  fail(
    eventId: string,
    ownerId: string,
    errorCode?: string,
  ): Promise<void>;
  recoverExpiredLeases(
    limit: number,
    now: Date,
  ): Promise<number>;
  stats(now: Date): Promise<OutboxStats>;
}


export interface SettlementRegistrationPersistence {
  registerSubmitted(input: {
    settlement: SettlementRecord;
    event: OutboxEvent;
    signature: string;
  }): Promise<SettlementRecord>;
}
