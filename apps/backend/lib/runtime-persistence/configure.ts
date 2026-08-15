import {
  createPrismaAuditPersistence,
  createPrismaIdempotencyPersistence,
  createPrismaRateLimitPersistence,
} from "./prisma";
import { createPrismaAtomicIdempotencyPersistence } from "./atomic-idempotency";
import { createPrismaMutationReceiptPersistence } from "./mutation-receipts";
import { createPrismaMutationLeasePersistence } from "./mutation-leases";
import { createPrismaSettlementPersistence } from "./settlements";
import { createPrismaOutboxPersistence } from "./outbox";
import { configureRuntimePersistence } from "./index";

type PrismaLike = Parameters<typeof createPrismaRateLimitPersistence>[0];

export function configureDatabaseRuntimePersistence(prisma: PrismaLike): void {
  configureRuntimePersistence({
    mode: "database",
    rateLimit: createPrismaRateLimitPersistence(prisma),
    idempotency: createPrismaIdempotencyPersistence(prisma),
    atomicIdempotency: createPrismaAtomicIdempotencyPersistence(prisma),
    mutationReceipts: createPrismaMutationReceiptPersistence(prisma),
    mutationLeases: createPrismaMutationLeasePersistence(prisma),
    settlements: createPrismaSettlementPersistence(prisma),
    outbox: createPrismaOutboxPersistence(prisma),
    audit: createPrismaAuditPersistence(prisma),
  });
}
