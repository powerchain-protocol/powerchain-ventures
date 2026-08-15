import type {
  AtomicIdempotencyPersistence,
  AuditPersistence,
  IdempotencyPersistence,
  MutationReceiptPersistence,
  MutationLeasePersistence,
  SettlementPersistence,
  SettlementRegistrationPersistence,
  OutboxPersistence,
  RateLimitPersistence,
} from "@powerchain/token-data";
import {
  memoryAuditPersistence,
  memoryAtomicIdempotencyPersistence,
  memoryIdempotencyPersistence,
  memoryMutationReceiptPersistence,
  memoryMutationLeasePersistence,
  memorySettlementPersistence,
  memorySettlementRegistrationPersistence,
  memoryOutboxPersistence,
  memoryRateLimitPersistence,
} from "./memory";

export type RuntimePersistence = {
  rateLimit: RateLimitPersistence;
  idempotency: IdempotencyPersistence;
  atomicIdempotency: AtomicIdempotencyPersistence;
  mutationReceipts: MutationReceiptPersistence;
  mutationLeases: MutationLeasePersistence;
  settlements: SettlementPersistence;
  settlementRegistration: SettlementRegistrationPersistence;
  outbox: OutboxPersistence;
  audit: AuditPersistence;
  mode: "memory" | "database";
};

let current: RuntimePersistence = {
  rateLimit: memoryRateLimitPersistence,
  idempotency: memoryIdempotencyPersistence,
  atomicIdempotency: memoryAtomicIdempotencyPersistence,
  mutationReceipts: memoryMutationReceiptPersistence,
  mutationLeases: memoryMutationLeasePersistence,
  settlements: memorySettlementPersistence,
  settlementRegistration: memorySettlementRegistrationPersistence,
  outbox: memoryOutboxPersistence,
  audit: memoryAuditPersistence,
  mode: "memory",
};

export function configureRuntimePersistence(value: RuntimePersistence): void {
  current = value;
}

export function getRuntimePersistence(): RuntimePersistence {
  return current;
}

export * from "./mode";
export * from "./schema";
export * from "./bootstrap";
