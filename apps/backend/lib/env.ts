type ServerEnv = {
  NODE_ENV: "development" | "test" | "production";
  SOLANA_RPC_URL: string;
  SOLANA_RPC_FALLBACK_URL?: string;
  POWERCHAIN_LAUNCHPAD_PROGRAM_ID?: string;
  POWERCHAIN_QUOTE_AUTHORITY_WALLET?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  HELIUS_API_KEY?: string;
  BIRDEYE_API_KEY?: string;
  CDP_API_KEY_ID?: string;
  CDP_API_KEY_SECRET?: string;
};

const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function required(name: string, value: string | undefined): string {
  if (!value?.trim()) throw new Error(`Missing required environment variable ${name}`);
  return value.trim();
}

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function optionalSolanaAddress(name: string, value: string | undefined): string | undefined {
  const normalized = optional(value);
  if (!normalized) return undefined;
  if (!SOLANA_ADDRESS_RE.test(normalized)) {
    throw new Error(`${name} is not a valid Solana address`);
  }
  return normalized;
}

export function getServerEnv(env: NodeJS.ProcessEnv = process.env): ServerEnv {
  const nodeEnv = env.NODE_ENV === "production" || env.NODE_ENV === "test"
    ? env.NODE_ENV
    : "development";

  const parsed: ServerEnv = {
    NODE_ENV: nodeEnv,
    SOLANA_RPC_URL: required("SOLANA_RPC_URL", env.SOLANA_RPC_URL),
    SOLANA_RPC_FALLBACK_URL: optional(env.SOLANA_RPC_FALLBACK_URL),
    POWERCHAIN_LAUNCHPAD_PROGRAM_ID: optionalSolanaAddress(
      "POWERCHAIN_LAUNCHPAD_PROGRAM_ID",
      env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID,
    ),
    POWERCHAIN_QUOTE_AUTHORITY_WALLET: optionalSolanaAddress(
      "POWERCHAIN_QUOTE_AUTHORITY_WALLET",
      env.POWERCHAIN_QUOTE_AUTHORITY_WALLET,
    ),
    SUPABASE_URL: optional(env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: optional(env.SUPABASE_SERVICE_ROLE_KEY),
    HELIUS_API_KEY: optional(env.HELIUS_API_KEY),
    BIRDEYE_API_KEY: optional(env.BIRDEYE_API_KEY),
    CDP_API_KEY_ID: optional(env.CDP_API_KEY_ID),
    CDP_API_KEY_SECRET: optional(env.CDP_API_KEY_SECRET),
  };

  if (nodeEnv === "production") {
    const url = new URL(parsed.SOLANA_RPC_URL);
    if (url.protocol !== "https:") {
      throw new Error("SOLANA_RPC_URL must use https in production");
    }
  }

  return parsed;
}

export type { ServerEnv };
