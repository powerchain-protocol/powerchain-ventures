import { POWERCHAIN_MOBILE } from "@/constants";

/** Public/mobile-safe configuration only. Never add server credentials here. */
export type MobileEnvironment = {
  apiUrl: string;
  webUrl: string | null;
  scheme: string;
  solanaCluster: "mainnet-beta" | "devnet";
  solanaRpcUrl: string | null;
  supabaseUrl: string;
  supabasePublishableKey: string;
  apiTimeoutMs: number;
};

function required(name: string, value: string | undefined): string {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`[PowerChain Mobile] Missing ${name}`);
  return normalized.replace(/\/$/, "");
}

function optionalUrl(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized.replace(/\/$/, "") : null;
}

function boundedTimeout(value: string | undefined): number {
  const parsed = Number(value ?? POWERCHAIN_MOBILE.defaultApiTimeoutMs);
  return Number.isFinite(parsed) ? Math.min(30_000, Math.max(3_000, parsed)) : POWERCHAIN_MOBILE.defaultApiTimeoutMs;
}

export function getMobileEnvironment(): MobileEnvironment {
  const cluster = process.env.EXPO_PUBLIC_SOLANA_CLUSTER === "devnet" ? "devnet" : POWERCHAIN_MOBILE.defaultCluster;
  return {
    apiUrl: required("EXPO_PUBLIC_API_URL", process.env.EXPO_PUBLIC_API_URL),
    webUrl: optionalUrl(process.env.EXPO_PUBLIC_WEB_URL),
    scheme: process.env.EXPO_PUBLIC_APP_SCHEME?.trim() || POWERCHAIN_MOBILE.scheme,
    solanaCluster: cluster,
    solanaRpcUrl: optionalUrl(process.env.EXPO_PUBLIC_SOLANA_RPC_URL),
    supabaseUrl: required("EXPO_PUBLIC_SUPABASE_URL", process.env.EXPO_PUBLIC_SUPABASE_URL),
    supabasePublishableKey: required("EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    apiTimeoutMs: boundedTimeout(process.env.EXPO_PUBLIC_API_TIMEOUT_MS),
  };
}
