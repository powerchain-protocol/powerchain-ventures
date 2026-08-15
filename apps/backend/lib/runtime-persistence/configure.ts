import {
  createPrismaAuditPersistence,
  createPrismaIdempotencyPersistence,
  createPrismaRateLimitPersistence,
} from "./prisma";
import { createPrismaAtomicIdempotencyPersistence } from "./atomic-idempotency";
import { createPrismaMutationReceiptPersistence } from "./mutation-receipts";
import { createPrismaMutationLeasePersistence } from "./mutation-leases";
import { createPrismaSettlementPersistence } from "./settlements";
import { createPrismaSettlementRegistrationPersistence } from "./settlement-registration";
import { createPrismaOutboxPersistence } from "./outbox";
import { configureRuntimePersistence } from "./index";

type QueryPrismaLike =
  Parameters<
    typeof createPrismaRateLimitPersistence
  >[0];

type TransactionPrismaLike =
  Parameters<
    typeof createPrismaSettlementRegistrationPersistence
  >[0];

type PrismaLike =
  QueryPrismaLike &
  TransactionPrismaLike;

export function configureDatabaseRuntimePersistence(
  prisma: PrismaLike,
): void {
  configureRuntimePersistence({
    mode: "database",
    rateLimit: createPrismaRateLimitPersistence(prisma),
    idempotency: createPrismaIdempotencyPersistence(prisma),
    atomicIdempotency: createPrismaAtomicIdempotencyPersistence(prisma),
    mutationReceipts: createPrismaMutationReceiptPersistence(prisma),
    mutationLeases: createPrismaMutationLeasePersistence(prisma),
    settlements: createPrismaSettlementPersistence(prisma),
    settlementRegistration: createPrismaSettlementRegistrationPersistence(prisma),
    outbox: createPrismaOutboxPersistence(prisma),
    audit: createPrismaAuditPersistence(prisma),
  });
}
