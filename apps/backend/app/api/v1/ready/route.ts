import {
  POWERCHAIN_FEE_WALLET_ADDRESS,
} from "@powerchain/launchpad-config";
import {
  integrationStatus,
} from "../../../../lib/integrations/config";
import {
  json,
} from "../../../../lib/http";
import {
  isSolanaAddress,
} from "../../../../lib/policy";
import {
  databaseConfigured,
} from "../../../../lib/supabase-rest";
import {
  rpcEndpoints,
  rpcHealth,
} from "../../../../lib/solana-rpc";
import {
  cdpSqlConfigured,
  cdpSqlRequired,
} from "../../../../lib/cdp-sql";
import {
  mainnetInfrastructureConfigured,
  verifyNetworkIdentity,
} from "../../../../lib/solana-network";
import {
  getLaunchpadProgramStatus,
} from "../../../../lib/program/status";
import {
  configuredQuoteAuthorityWallet,
} from "../../../../lib/program/config";
import {
  authEnabled,
} from "../../../../lib/auth";
import {
  bootstrapRuntimePersistence,
  runtimeBootstrapStatus,
} from "../../../../lib/runtime-persistence/bootstrap";
import {
  checkRuntimePersistenceHealth,
} from "../../../../lib/runtime-persistence/health";

export const runtime =
  "nodejs";
export const dynamic =
  "force-dynamic";

export async function GET() {
  const cluster =
    process.env
      .NEXT_PUBLIC_SOLANA_CLUSTER ===
    "devnet"
      ? "devnet"
      : "mainnet-beta";

  const treasury =
    process.env
      .POWERCHAIN_TREASURY_WALLET
      ?.trim() ||
    POWERCHAIN_FEE_WALLET_ADDRESS;

  const rpc =
    rpcEndpoints();

  const chain =
    rpc.length
      ? await rpcHealth()
      : {
          ok: false,
          error:
            "not_configured",
          attempts: [],
        };

  const infrastructure =
    mainnetInfrastructureConfigured();

  let identity:
    | Awaited<
        ReturnType<
          typeof verifyNetworkIdentity
        >
      >
    | null = null;

  let identityError:
    string | null = null;

  try {
    identity =
      await verifyNetworkIdentity();
  } catch (error) {
    identityError =
      error instanceof Error
        ? error.message
        : "network_identity_failed";
  }

  const cdpConfigured =
    cdpSqlConfigured();

  const providers =
    integrationStatus();

  const program =
    await getLaunchpadProgramStatus();

  let runtimeHealth:
    Awaited<
      ReturnType<
        typeof checkRuntimePersistenceHealth
      >
    > | null = null;

  let runtimeError:
    string | null = null;

  try {
    await bootstrapRuntimePersistence();
    runtimeHealth =
      await checkRuntimePersistenceHealth();
  } catch (error) {
    runtimeError =
      error instanceof Error
        ? error.message
        : "runtime_persistence_unavailable";
  }

  const outboxFailedTolerance =
    Number(
      process.env
        .SETTLEMENT_OUTBOX_FAILED_TOLERANCE ??
        0,
    );

  const outboxMaxPendingAgeMs =
    Number(
      process.env
        .SETTLEMENT_OUTBOX_MAX_PENDING_AGE_MS ??
        300_000,
    );

  const oldestPendingAgeMs =
    runtimeHealth?.outbox
      ?.oldestPendingAt
      ? Math.max(
          0,
          Date.now() -
            Date.parse(
              runtimeHealth
                .outbox
                .oldestPendingAt,
            ),
        )
      : 0;

  const outboxOperational =
    Boolean(
      runtimeHealth
        ?.outboxReady,
    ) &&
    (
      runtimeHealth?.outbox
        ?.expiredLeases ??
      0
    ) === 0 &&
    (
      runtimeHealth?.outbox
        ?.failed ??
      0
    ) <=
      outboxFailedTolerance &&
    oldestPendingAgeMs <=
      outboxMaxPendingAgeMs;

  const checks = {
    solanaRpc:
      chain.ok,
    networkIdentity:
      Boolean(
        identity?.verified,
      ),
    dedicatedRpc:
      infrastructure.dedicated,
    rpcRedundancy:
      infrastructure.redundant,
    treasury:
      isSolanaAddress(
        treasury,
      ),
    database:
      databaseConfigured(),
    runtimePersistence:
      Boolean(
        runtimeHealth?.ready,
      ),
    runtimePersistenceMode:
      process.env.NODE_ENV !==
        "production" ||
      runtimeHealth?.mode ===
        "database",
    settlementOutbox:
      outboxOperational,
    transactionBuilder:
      Boolean(
        process.env
          .POWERCHAIN_TRANSACTION_BUILDER_URL,
      ),
    transactionBuilderKey:
      Boolean(
        (
          process.env
            .POWERCHAIN_TRANSACTION_BUILDER_API_KEY ??
          ""
        ).length >= 20,
      ),
    solUsdPriceSource:
      Boolean(
        providers.pythConfigured ||
        providers.birdeyeConfigured ||
        providers.coinMarketCapConfigured,
      ),
    quoteAuthoritySigner:
      Boolean(
        process.env
          .POWERCHAIN_QUOTE_AUTHORITY_KEYPAIR_JSON
          ?.trim(),
      ),
    reconciliationSecret:
      Boolean(
        (
          process.env
            .CRON_SECRET
            ?.trim() ||
          process.env
            .RECONCILIATION_SECRET
            ?.trim() ||
          ""
        ).length >= 32,
      ),
    allowedOrigins:
      Boolean(
        (
          process.env
            .ALLOWED_ORIGINS ??
          process.env
            .NEXT_PUBLIC_APP_URL ??
          ""
        ).trim(),
      ),
    launchpadProgramId:
      isSolanaAddress(
        process.env
          .POWERCHAIN_LAUNCHPAD_PROGRAM_ID ??
          "",
      ),
    launchpadProgramDeployed:
      program.deployed &&
      program.executable,
    quoteAuthority:
      isSolanaAddress(
        configuredQuoteAuthorityWallet() ??
          "",
      ),
    cdpSql:
      !cdpSqlRequired() ||
      cdpConfigured,
    accountAuth:
      process.env
        .POWERCHAIN_AUTH_ENABLED ===
        "false" ||
      authEnabled(),
  };

  const ok =
    Object.values(
      checks,
    ).every(Boolean);

  return json(
    {
      ok,
      version: "1.0.0",
      cluster,
      checks,

      runtimePersistence:
        runtimeHealth
          ? {
              ...runtimeHealth,
              oldestPendingAgeMs,
              outboxFailedTolerance,
              outboxMaxPendingAgeMs,
            }
          : {
              ...runtimeBootstrapStatus(),
              error:
                runtimeError,
            },

      program: {
        configured:
          program.configured,
        deployed:
          program.deployed,
        executable:
          program.executable,
        programId:
          program.programId,
        quoteAuthorityConfigured:
          Boolean(
            program
              .quoteAuthorityWallet,
          ),
      },

      integrations:
        providers,

      analytics: {
        provider:
          "coinbase-cdp-sql",
        configured:
          cdpConfigured,
        required:
          cdpSqlRequired(),
        network:
          "solana-mainnet",
        beta: true,
      },

      networkIdentity:
        identity
          ? {
              verified: true,
              genesisHash:
                identity
                  .genesisHash,
              slot:
                identity.slot,
              blockHeight:
                identity
                  .blockHeight,
              version:
                identity.version,
            }
          : {
              verified: false,
              error:
                identityError,
            },

      rpc: {
        configured:
          rpc.length,
        active:
          "endpoint" in chain
            ? chain.endpoint
            : null,
        latencyMs:
          "latencyMs" in chain
            ? chain.latencyMs
            : null,
        attempts:
          chain.attempts.map(
            attempt => ({
              index:
                rpc.findIndex(
                  value =>
                    value.url ===
                    attempt.url,
                ),
              ok:
                attempt.ok,
              latencyMs:
                attempt
                  .latencyMs,
              error:
                attempt.error,
            }),
          ),
      },
    },
    {
      status:
        ok
          ? 200
          : 503,
    },
  );
}
