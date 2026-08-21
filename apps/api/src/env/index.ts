import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { z } from "zod";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });
dotenv.config({ path: fileURLToPath(new URL("../../../../.env", import.meta.url)) });

const booleanEnv = z.enum(["true", "false"]).default("false").transform((value) => value === "true");
const optionalUrl = z.string().url().optional().or(z.literal(""));
const cluster = z.enum(["devnet", "mainnet-beta", "testnet"]);

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  API_PUBLIC_URL: z.string().url().default("http://localhost:4000"),
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:3001"),
  AUTH_TRUSTED_ORIGINS: z.string().default("http://localhost:3000,http://localhost:3001"),
  POWERCHAIN_DATA_MODE: z.enum(["mock", "database"]).default("mock"),
  POWERCHAIN_CACHE_TTL_MS: z.coerce.number().int().min(1000).max(300_000).default(15_000),

  BETTER_AUTH_URL: z.string().url().default("http://localhost:4000"),
  BETTER_AUTH_SECRET: z.string().min(32).default("powerchain-development-auth-secret-change-before-production"),
  AUTH_COOKIE_DOMAIN: z.string().optional().default(""),
  TURNSTILE_SECRET_KEY: z.string().optional().default(""),
  TRUST_CLOUDFLARE_PROXY: booleanEnv,
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(10).default(1),

  SOLANA_CLUSTER: cluster.default("devnet"),
  SOLANA_RPC_PROVIDER: z.enum(["auto", "helius", "solana", "custom"]).default("auto"),
  SOLANA_RPC_URL: optionalUrl,
  SOLANA_FALLBACK_RPC_URL: optionalUrl,
  SOLANA_WS_URL: optionalUrl,
  SOLANA_FALLBACK_WS_URL: optionalUrl,
  SOLANA_COMMITMENT: z.enum(["processed", "confirmed", "finalized"]).default("confirmed"),
  SOLANA_RPC_FAILURE_THRESHOLD: z.coerce.number().int().min(1).max(20).default(3),
  SOLANA_RPC_COOLDOWN_MS: z.coerce.number().int().min(1000).max(300_000).default(30_000),
  POWERCHAIN_LAUNCHPAD_PROGRAM_ID: z.string().optional().default(""),

  HELIUS_API_KEY: z.string().optional().default(""),
  HELIUS_RPC_URL: optionalUrl,
  HELIUS_WS_URL: optionalUrl,

  PYTH_API_KEY: z.string().optional().default(""),
  PYTH_HERMES_URL: z.string().url().default("https://pyth.dourolabs.app/hermes"),
  PYTH_SOL_USD_FEED_ID: z.string().default("0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d"),

  BIRDEYE_API_KEY: z.string().optional().default(""),
  BIRDEYE_BASE_URL: z.string().url().default("https://public-api.birdeye.so"),

  COINGECKO_API_KEY: z.string().optional().default(""),
  COINGECKO_PLAN: z.enum(["public", "demo", "pro"]).default("public"),
  COINGECKO_BASE_URL: z.string().url().default("https://api.coingecko.com/api/v3"),
  MARKET_PROVIDER_ORDER: z.string().default("pyth,birdeye,coingecko"),

  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),
  SUPABASE_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default("")
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid PowerChain API environment", parsed.error.flatten().fieldErrors);
  throw new Error("invalid_environment");
}

const data = parsed.data;
if (data.POWERCHAIN_DATA_MODE === "database" && !data.DATABASE_URL) throw new Error("DATABASE_URL is required when POWERCHAIN_DATA_MODE=database");
if (data.SOLANA_RPC_PROVIDER === "custom" && !data.SOLANA_RPC_URL) throw new Error("SOLANA_RPC_URL is required when SOLANA_RPC_PROVIDER=custom");
if (data.SOLANA_RPC_PROVIDER === "helius" && !data.HELIUS_API_KEY && !data.HELIUS_RPC_URL) throw new Error("HELIUS_API_KEY or HELIUS_RPC_URL is required when SOLANA_RPC_PROVIDER=helius");
if (data.NODE_ENV === "production" && data.BETTER_AUTH_SECRET.includes("development-auth-secret")) throw new Error("BETTER_AUTH_SECRET must be replaced in production");

if (data.NODE_ENV === "production") {
  if (!data.DATABASE_URL) throw new Error("DATABASE_URL is required in production");
  for (const [label, value] of Object.entries({ BETTER_AUTH_URL: data.BETTER_AUTH_URL, API_PUBLIC_URL: data.API_PUBLIC_URL, SOLANA_RPC_URL: data.SOLANA_RPC_URL || undefined, SOLANA_FALLBACK_RPC_URL: data.SOLANA_FALLBACK_RPC_URL || undefined, HELIUS_RPC_URL: data.HELIUS_RPC_URL || undefined })) {
    if (value && new URL(value).protocol !== "https:") throw new Error(`${label} must use HTTPS in production`);
  }
  const productionOrigins = [...data.CORS_ORIGIN.split(","), ...data.AUTH_TRUSTED_ORIGINS.split(",")].map((value) => value.trim()).filter(Boolean);
  if (productionOrigins.some((origin) => origin.includes("*") || !origin.startsWith("https://"))) throw new Error("CORS_ORIGIN and AUTH_TRUSTED_ORIGINS must be exact HTTPS origins in production");
}

export const env = data;
export const corsOrigins = data.CORS_ORIGIN.split(",").map((value) => value.trim()).filter(Boolean);
export const authTrustedOrigins = data.AUTH_TRUSTED_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean);
export const marketProviderOrder = data.MARKET_PROVIDER_ORDER.split(",").map((value) => value.trim().toLowerCase()).filter((value): value is "pyth" | "birdeye" | "coingecko" => ["pyth", "birdeye", "coingecko"].includes(value));
