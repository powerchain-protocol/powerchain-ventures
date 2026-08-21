CREATE TABLE "UserPreference" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "emailAlerts" BOOLEAN NOT NULL DEFAULT true,
  "launchAlerts" BOOLEAN NOT NULL DEFAULT true,
  "transactionAlerts" BOOLEAN NOT NULL DEFAULT true,
  "marketAlerts" BOOLEAN NOT NULL DEFAULT false,
  "timezone" TEXT NOT NULL DEFAULT 'UTC',
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
