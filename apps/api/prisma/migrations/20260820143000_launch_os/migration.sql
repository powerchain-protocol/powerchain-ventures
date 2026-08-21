CREATE TYPE "AuthorityType" AS ENUM ('TOKEN_MINT','TOKEN_FREEZE','SALE_CONFIGURATION','TREASURY','VESTING','PROGRAM_UPGRADE');
CREATE TYPE "EligibilityStatus" AS ENUM ('PENDING','ELIGIBLE','INELIGIBLE','REVIEW');
CREATE TYPE "VestingStatus" AS ENUM ('SCHEDULED','ACTIVE','COMPLETED','CANCELLED');
CREATE TYPE "SettlementStatus" AS ENUM ('PENDING','SUBMITTED','CONFIRMED','RECONCILED','FAILED');
CREATE TYPE "ChainTransactionStatus" AS ENUM ('PREPARED','SIMULATED','AWAITING_SIGNATURE','SUBMITTED','CONFIRMED','FAILED','REJECTED');

ALTER TABLE "SalePhase" ADD COLUMN "settlementAsset" TEXT NOT NULL DEFAULT 'USDC';
ALTER TABLE "SalePhase" ADD COLUMN "minContribution" DECIMAL(30,9);
ALTER TABLE "SalePhase" ADD COLUMN "maxContribution" DECIMAL(30,9);
CREATE INDEX "SalePhase_startsAt_endsAt_idx" ON "SalePhase"("startsAt","endsAt");
CREATE INDEX "Launch_category_idx" ON "Launch"("category");
CREATE INDEX "Participation_status_createdAt_idx" ON "Participation"("status","createdAt");
CREATE INDEX "Claim_status_unlockAt_idx" ON "Claim"("status","unlockAt");
CREATE INDEX "AuditEvent_resource_resourceId_idx" ON "AuditEvent"("resource","resourceId");

CREATE TABLE "LaunchAuthority" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "launchId" UUID NOT NULL, "type" "AuthorityType" NOT NULL, "address" TEXT,
  "controlType" TEXT NOT NULL, "revoked" BOOLEAN NOT NULL DEFAULT false, "metadata" JSONB, "verifiedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LaunchAuthority_pkey" PRIMARY KEY ("id"), CONSTRAINT "LaunchAuthority_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "Launch"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "LaunchAuthority_launchId_type_key" ON "LaunchAuthority"("launchId","type");
CREATE INDEX "LaunchAuthority_address_idx" ON "LaunchAuthority"("address");

CREATE TABLE "EligibilityRecord" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "launchId" UUID NOT NULL, "walletAddress" TEXT NOT NULL, "status" "EligibilityStatus" NOT NULL DEFAULT 'PENDING',
  "source" TEXT, "reason" TEXT, "metadata" JSONB, "checkedAt" TIMESTAMPTZ, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EligibilityRecord_pkey" PRIMARY KEY ("id"), CONSTRAINT "EligibilityRecord_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "Launch"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "EligibilityRecord_launchId_walletAddress_key" ON "EligibilityRecord"("launchId","walletAddress");
CREATE INDEX "EligibilityRecord_launchId_status_idx" ON "EligibilityRecord"("launchId","status");

CREATE TABLE "VestingSchedule" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "launchId" UUID NOT NULL, "walletAddress" TEXT NOT NULL, "totalAmount" DECIMAL(30,9) NOT NULL, "claimedAmount" DECIMAL(30,9) NOT NULL DEFAULT 0,
  "tgeBps" INTEGER NOT NULL DEFAULT 0, "cliffAt" TIMESTAMPTZ, "startsAt" TIMESTAMPTZ NOT NULL, "endsAt" TIMESTAMPTZ NOT NULL, "status" "VestingStatus" NOT NULL DEFAULT 'SCHEDULED',
  "provider" TEXT, "externalId" TEXT, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VestingSchedule_pkey" PRIMARY KEY ("id"), CONSTRAINT "VestingSchedule_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "Launch"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "VestingSchedule_launchId_walletAddress_idx" ON "VestingSchedule"("launchId","walletAddress");
CREATE INDEX "VestingSchedule_status_startsAt_idx" ON "VestingSchedule"("status","startsAt");

CREATE TABLE "Settlement" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "launchId" UUID NOT NULL, "asset" TEXT NOT NULL, "grossAmount" DECIMAL(30,9) NOT NULL, "feeAmount" DECIMAL(30,9) NOT NULL DEFAULT 0,
  "netAmount" DECIMAL(30,9) NOT NULL, "treasuryWallet" TEXT NOT NULL, "txSignature" TEXT, "status" "SettlementStatus" NOT NULL DEFAULT 'PENDING', "reconciledAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id"), CONSTRAINT "Settlement_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "Launch"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Settlement_txSignature_key" ON "Settlement"("txSignature");
CREATE INDEX "Settlement_launchId_status_idx" ON "Settlement"("launchId","status");

CREATE TABLE "ChainTransaction" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "launchId" UUID, "kind" TEXT NOT NULL, "walletAddress" TEXT, "signature" TEXT, "status" "ChainTransactionStatus" NOT NULL DEFAULT 'PREPARED',
  "feeLamports" BIGINT, "slot" BIGINT, "errorCode" TEXT, "metadata" JSONB, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChainTransaction_pkey" PRIMARY KEY ("id"), CONSTRAINT "ChainTransaction_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "Launch"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ChainTransaction_signature_key" ON "ChainTransaction"("signature");
CREATE INDEX "ChainTransaction_launchId_status_idx" ON "ChainTransaction"("launchId","status");
CREATE INDEX "ChainTransaction_walletAddress_createdAt_idx" ON "ChainTransaction"("walletAddress","createdAt");
