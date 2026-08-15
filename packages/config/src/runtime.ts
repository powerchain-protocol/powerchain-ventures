import {
  POWERCHAIN_FEE_WALLET_ADDRESS,
  SOLANA_MAINNET_GENESIS_PREFIX,
  SOLANA_MAINNET_PUBLIC_RPC_HOSTS,
  SOLANA_SYSTEM_PROGRAM_ID,
} from "./constants.js";
import {
  HELIUS_API_BASE,
  parseCsvUrls,
  parseRpcProvider,
  resolveServerRpcUrls,
  type SolanaRpcProvider,
} from "./rpc.js";

type Env = Record<string, string | undefined>;

export type SolanaCluster = "devnet" | "mainnet-beta";

export interface PublicRuntimeConfig {
  appUrl: string;
  solanaCluster: SolanaCluster;
  solanaRpcUrl: string;
}

export interface ServerRuntimeConfig extends PublicRuntimeConfig {
  backendOrigin: string;
  rpcProvider: SolanaRpcProvider;
  rpcUrls: string[];
  heliusConfigured: boolean;
  heliusApiBaseUrl: string;
  expectedGenesisPrefix: string;
  supabaseUrl: string;
  treasuryWallet: string;
  transactionBuilderUrl: string;
  allowedOrigins: string[];
  launchpadProgramId: string;
  quoteAuthorityWallet: string;
}

const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function requireValue(source: Env, name: string): string {
  const value = source[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function requireUrl(source: Env, name: string, production: boolean): string {
  const value = requireValue(source, name);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid URL`);
  }
  if (production && url.protocol !== "https:") {
    throw new Error(`${name} must use https in production`);
  }
  return url.toString().replace(/\/$/, "");
}

function optionalUrl(
  source: Env,
  name: string,
  production: boolean,
): string | undefined {
  const value = source[name]?.trim();
  if (!value) return undefined;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid URL`);
  }
  if (production && url.protocol !== "https:") {
    throw new Error(`${name} must use https in production`);
  }
  return url.toString();
}

function clusterOf(source: Env): SolanaCluster {
  const cluster = source.NEXT_PUBLIC_SOLANA_CLUSTER?.trim();
  if (cluster !== "devnet" && cluster !== "mainnet-beta") {
    throw new Error(
      "NEXT_PUBLIC_SOLANA_CLUSTER must be devnet or mainnet-beta",
    );
  }
  return cluster;
}

function normalizeAllowedOrigin(value: string, production: boolean): string {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error(`Invalid ALLOWED_ORIGINS entry: ${value}`);
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`ALLOWED_ORIGINS must use http or https: ${value}`);
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(`ALLOWED_ORIGINS entries must be origins only: ${value}`);
  }
  if (production && url.protocol !== "https:") {
    throw new Error(`Production ALLOWED_ORIGINS must use https: ${value}`);
  }
  return url.origin;
}

export function getPublicRuntimeConfig(
  source: Env = (
    globalThis as typeof globalThis & { process?: { env?: Env } }
  ).process?.env ?? {},
): PublicRuntimeConfig {
  const production = source.NODE_ENV === "production";
  return {
    appUrl: requireUrl(source, "NEXT_PUBLIC_APP_URL", production),
    solanaCluster: clusterOf(source),
    solanaRpcUrl: requireUrl(
      source,
      "NEXT_PUBLIC_SOLANA_RPC_URL",
      production,
    ),
  };
}

export function getServerRuntimeConfig(
  source: Env = (
    globalThis as typeof globalThis & { process?: { env?: Env } }
  ).process?.env ?? {},
): ServerRuntimeConfig {
  const production = source.NODE_ENV === "production";
  const base = getPublicRuntimeConfig(source);
  const rpcProvider = parseRpcProvider(source.SOLANA_RPC_PROVIDER);

  const heliusApiKey = source.HELIUS_API_KEY?.trim();
  const heliusRpcBaseUrl = optionalUrl(
    source,
    "HELIUS_RPC_URL",
    production,
  );
  const heliusApiBaseUrl =
    optionalUrl(source, "HELIUS_API_URL", production) ?? HELIUS_API_BASE;

  const customPrimaryUrl = optionalUrl(
    source,
    "CUSTOM_SOLANA_RPC_URL",
    production,
  );
  const customFallbackUrls = parseCsvUrls(
    source.CUSTOM_SOLANA_RPC_FALLBACK_URLS,
  );
  const legacyPrimaryUrl = optionalUrl(
    source,
    "SOLANA_RPC_URL",
    production,
  );
  const legacyFallbackUrl = optionalUrl(
    source,
    "SOLANA_RPC_FALLBACK_URL",
    production,
  );
  const legacyFallbackUrls = parseCsvUrls(
    source.SOLANA_RPC_FALLBACK_URLS,
  );

  const rpcUrls = resolveServerRpcUrls({
    cluster:
      base.solanaCluster,
    provider:
      rpcProvider,
    ...(heliusApiKey
      ? {
          heliusApiKey,
        }
      : {}),
    ...(heliusRpcBaseUrl
      ? {
          heliusRpcBaseUrl,
        }
      : {}),
    ...(customPrimaryUrl
      ? {
          customPrimaryUrl,
        }
      : {}),
    ...(customFallbackUrls.length
      ? {
          customFallbackUrls,
        }
      : {}),
    ...(legacyPrimaryUrl
      ? {
          legacyPrimaryUrl,
        }
      : {}),
    ...(legacyFallbackUrl
      ? {
          legacyFallbackUrl,
        }
      : {}),
    ...(legacyFallbackUrls.length
      ? {
          legacyFallbackUrls,
        }
      : {}),
    allowPublicFallback:
      !production,
  });

  for (const rpc of rpcUrls) {
    const url = new URL(rpc);
    if (production && url.protocol !== "https:") {
      throw new Error(
        "Solana RPC endpoints must use https in production",
      );
    }
  }

  if (production && base.solanaCluster === "mainnet-beta") {
    const browserRpcHost = new URL(base.solanaRpcUrl).hostname;
    const browserIsBackendProxy =
      new URL(base.solanaRpcUrl).pathname === "/api/v1/solana/rpc";
    if (
      !browserIsBackendProxy &&
      SOLANA_MAINNET_PUBLIC_RPC_HOSTS.has(browserRpcHost)
    ) {
      throw new Error(
        "NEXT_PUBLIC_SOLANA_RPC_URL must use the backend RPC proxy or a dedicated browser-safe RPC endpoint on mainnet",
      );
    }
    if (rpcUrls.length < 2) {
      throw new Error(
        "mainnet-beta production requires at least two server-side RPC endpoints",
      );
    }
    if (
      rpcUrls.some(rpc =>
        SOLANA_MAINNET_PUBLIC_RPC_HOSTS.has(new URL(rpc).hostname)
      )
    ) {
      throw new Error(
        "mainnet-beta production requires dedicated/private server-side RPC endpoints",
      );
    }
  }

  const expectedGenesisPrefix =
    source.SOLANA_EXPECTED_GENESIS_PREFIX?.trim() ||
    (base.solanaCluster === "mainnet-beta"
      ? SOLANA_MAINNET_GENESIS_PREFIX
      : "");

  if (
    production &&
    base.solanaCluster === "mainnet-beta" &&
    expectedGenesisPrefix !== SOLANA_MAINNET_GENESIS_PREFIX
  ) {
    throw new Error(
      "SOLANA_EXPECTED_GENESIS_PREFIX must identify Solana mainnet-beta",
    );
  }

  const treasuryWallet =
    source.POWERCHAIN_TREASURY_WALLET?.trim() ||
    POWERCHAIN_FEE_WALLET_ADDRESS;
  const launchpadProgramId =
    source.POWERCHAIN_LAUNCHPAD_PROGRAM_ID?.trim() ?? "";
  const quoteAuthorityWallet =
    source.POWERCHAIN_QUOTE_AUTHORITY_WALLET?.trim() ?? "";

  if (
    production &&
    base.solanaCluster === "mainnet-beta" &&
    !SOLANA_ADDRESS.test(launchpadProgramId)
  ) {
    throw new Error(
      "POWERCHAIN_LAUNCHPAD_PROGRAM_ID must be the real deployed Solana program address",
    );
  }
  if (
    production &&
    base.solanaCluster === "mainnet-beta" &&
    !SOLANA_ADDRESS.test(quoteAuthorityWallet)
  ) {
    throw new Error(
      "POWERCHAIN_QUOTE_AUTHORITY_WALLET must be the real quote-authority signer address",
    );
  }
  if (!SOLANA_ADDRESS.test(treasuryWallet)) {
    throw new Error(
      "POWERCHAIN_TREASURY_WALLET must be a valid Solana address",
    );
  }
  if (treasuryWallet === SOLANA_SYSTEM_PROGRAM_ID) {
    throw new Error(
      "POWERCHAIN_TREASURY_WALLET cannot be the Solana System Program",
    );
  }
  if (treasuryWallet !== POWERCHAIN_FEE_WALLET_ADDRESS) {
    throw new Error(
      "POWERCHAIN_TREASURY_WALLET must equal the canonical PowerChain fee wallet",
    );
  }

  const allowedOrigins = (source.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map(value => value.trim())
    .filter(Boolean)
    .map(value => normalizeAllowedOrigin(value, production));

  if (production && !allowedOrigins.length) {
    throw new Error("ALLOWED_ORIGINS is required in production");
  }

  return {
    ...base,
    backendOrigin: requireUrl(source, "BACKEND_ORIGIN", production),
    rpcProvider,
    rpcUrls,
    heliusConfigured: Boolean(heliusApiKey),
    heliusApiBaseUrl,
    expectedGenesisPrefix,
    supabaseUrl: requireUrl(source, "SUPABASE_URL", production),
    treasuryWallet,
    transactionBuilderUrl: requireUrl(
      source,
      "POWERCHAIN_TRANSACTION_BUILDER_URL",
      production,
    ),
    launchpadProgramId,
    quoteAuthorityWallet,
    allowedOrigins: [...new Set(allowedOrigins)],
  };
}
