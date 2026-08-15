import {
  PrismaPg,
} from "@prisma/adapter-pg";
import {
  PrismaClient,
} from "../../../../generated/prisma/client";

type GlobalPrisma = typeof globalThis & {
  __powerchainRuntimePrisma?:
    PrismaClient;
};

function databaseUrl() {
  const value =
    process.env.DATABASE_URL?.trim();

  if (!value) {
    throw new Error(
      "DATABASE_URL is required for database runtime persistence",
    );
  }

  return value;
}

export function runtimePrismaClient():
  PrismaClient {
  const globalValue =
    globalThis as GlobalPrisma;

  if (
    globalValue
      .__powerchainRuntimePrisma
  ) {
    return globalValue
      .__powerchainRuntimePrisma;
  }

  const adapter =
    new PrismaPg({
      connectionString:
        databaseUrl(),
    });

  const client =
    new PrismaClient({
      adapter,
    });

  // Reuse one client in development HMR and in a long-running
  // Node.js process. Serverless isolates still get one client per isolate.
  globalValue
    .__powerchainRuntimePrisma =
    client;

  return client;
}
