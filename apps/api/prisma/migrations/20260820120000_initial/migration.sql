CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "LaunchStatus" AS ENUM ('DRAFT','REVIEW','SCHEDULED','LIVE','PAUSED','ENDED','CLAIMABLE','COMPLETED','CANCELLED');
CREATE TYPE "PhaseStatus" AS ENUM ('DRAFT','SCHEDULED','LIVE','PAUSED','ENDED');
CREATE TYPE "ParticipationStatus" AS ENUM ('PENDING','CONFIRMED','FAILED','REFUNDED');
CREATE TYPE "ClaimStatus" AS ENUM ('LOCKED','AVAILABLE','SUBMITTED','CLAIMED','FAILED');

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL,
  "displayName" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Wallet" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "address" TEXT NOT NULL,
  "chain" TEXT NOT NULL DEFAULT 'SOLANA',
  "userId" UUID,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

CREATE TABLE "Launch" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "status" "LaunchStatus" NOT NULL DEFAULT 'DRAFT',
  "tokenMint" TEXT,
  "treasuryWallet" TEXT,
  "targetAmount" DECIMAL(30,9),
  "settlementAsset" TEXT NOT NULL DEFAULT 'USDC',
  "startsAt" TIMESTAMPTZ,
  "endsAt" TIMESTAMPTZ,
  "creatorId" UUID,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Launch_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Launch_slug_key" ON "Launch"("slug");
CREATE INDEX "Launch_creatorId_idx" ON "Launch"("creatorId");
CREATE INDEX "Launch_status_idx" ON "Launch"("status");

CREATE TABLE "SalePhase" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "launchId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "status" "PhaseStatus" NOT NULL DEFAULT 'DRAFT',
  "price" DECIMAL(30,12) NOT NULL,
  "allocation" DECIMAL(30,9) NOT NULL,
  "startsAt" TIMESTAMPTZ,
  "endsAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SalePhase_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SalePhase_launchId_status_idx" ON "SalePhase"("launchId", "status");

CREATE TABLE "Participation" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "launchId" UUID NOT NULL,
  "phaseId" UUID,
  "walletAddress" TEXT NOT NULL,
  "contribution" DECIMAL(30,9) NOT NULL,
  "allocation" DECIMAL(30,9) NOT NULL,
  "settlementAsset" TEXT NOT NULL DEFAULT 'USDC',
  "txSignature" TEXT,
  "status" "ParticipationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Participation_txSignature_key" ON "Participation"("txSignature");
CREATE INDEX "Participation_launchId_walletAddress_idx" ON "Participation"("launchId", "walletAddress");
CREATE INDEX "Participation_phaseId_idx" ON "Participation"("phaseId");

CREATE TABLE "Claim" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "launchId" UUID NOT NULL,
  "walletAddress" TEXT NOT NULL,
  "amount" DECIMAL(30,9) NOT NULL,
  "unlockAt" TIMESTAMPTZ NOT NULL,
  "txSignature" TEXT,
  "status" "ClaimStatus" NOT NULL DEFAULT 'LOCKED',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Claim_txSignature_key" ON "Claim"("txSignature");
CREATE INDEX "Claim_launchId_walletAddress_unlockAt_idx" ON "Claim"("launchId", "walletAddress", "unlockAt");

CREATE TABLE "AuditEvent" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "launchId" UUID,
  "requestId" TEXT NOT NULL,
  "actor" TEXT,
  "action" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "resourceId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuditEvent_launchId_createdAt_idx" ON "AuditEvent"("launchId", "createdAt");
CREATE INDEX "AuditEvent_requestId_idx" ON "AuditEvent"("requestId");

ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Launch" ADD CONSTRAINT "Launch_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SalePhase" ADD CONSTRAINT "SalePhase_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "Launch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "Launch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "SalePhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "Launch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "Launch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
