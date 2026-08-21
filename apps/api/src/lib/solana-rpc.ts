import { Connection } from "@solana/web3.js";
import type { SolanaFallbackHealth } from "@powerchain/types";
import { env } from "../env/index.js";
import { AppError } from "../common/errors.js";
import { redactUrl } from "../common/utils/helpers.js";

const PUBLIC_RPC: Record<typeof env.SOLANA_CLUSTER, string> = {
  devnet: "https://api.devnet.solana.com",
  "mainnet-beta": "https://api.mainnet-beta.solana.com",
  testnet: "https://api.testnet.solana.com"
};
const PUBLIC_WS: Record<typeof env.SOLANA_CLUSTER, string> = {
  devnet: "wss://api.devnet.solana.com",
  "mainnet-beta": "wss://api.mainnet-beta.solana.com",
  testnet: "wss://api.testnet.solana.com"
};

type CircuitState = { consecutiveFailures: number; openUntil: number };
const primaryCircuit: CircuitState = { consecutiveFailures: 0, openUntil: 0 };
const fallbackCircuit: CircuitState = { consecutiveFailures: 0, openUntil: 0 };

function derivedHeliusRpcUrl() {
  if (env.HELIUS_RPC_URL) return env.HELIUS_RPC_URL;
  if (!env.HELIUS_API_KEY || env.SOLANA_CLUSTER === "testnet") return "";
  const host = env.SOLANA_CLUSTER === "mainnet-beta" ? "mainnet.helius-rpc.com" : "devnet.helius-rpc.com";
  return `https://${host}/?api-key=${encodeURIComponent(env.HELIUS_API_KEY)}`;
}
function derivedHeliusWsUrl() {
  if (env.HELIUS_WS_URL) return env.HELIUS_WS_URL;
  if (!env.HELIUS_API_KEY || env.SOLANA_CLUSTER === "testnet") return "";
  const host = env.SOLANA_CLUSTER === "mainnet-beta" ? "mainnet.helius-rpc.com" : "devnet.helius-rpc.com";
  return `wss://${host}/?api-key=${encodeURIComponent(env.HELIUS_API_KEY)}`;
}

export function resolveSolanaRpcUrl() {
  const publicRpc = PUBLIC_RPC[env.SOLANA_CLUSTER];
  if (env.SOLANA_RPC_PROVIDER === "custom") return env.SOLANA_RPC_URL || publicRpc;
  if (env.SOLANA_RPC_PROVIDER === "solana") return env.SOLANA_RPC_URL || publicRpc;
  if (env.SOLANA_RPC_PROVIDER === "helius") return derivedHeliusRpcUrl() || publicRpc;
  return derivedHeliusRpcUrl() || env.SOLANA_RPC_URL || publicRpc;
}
export function resolveSolanaWsUrl() {
  if (env.SOLANA_WS_URL) return env.SOLANA_WS_URL;
  if (resolveSolanaRpcUrl().includes("helius-rpc.com")) return derivedHeliusWsUrl() || PUBLIC_WS[env.SOLANA_CLUSTER];
  return PUBLIC_WS[env.SOLANA_CLUSTER];
}
export function resolveSolanaFallbackRpcUrl() {
  const primary = resolveSolanaRpcUrl();
  const fallback = env.SOLANA_FALLBACK_RPC_URL || PUBLIC_RPC[env.SOLANA_CLUSTER];
  return fallback === primary ? "" : fallback;
}
export function resolveSolanaFallbackWsUrl() { return env.SOLANA_FALLBACK_WS_URL || PUBLIC_WS[env.SOLANA_CLUSTER]; }

let primaryConnection: Connection | undefined;
let fallbackConnection: Connection | undefined;
export function getSolanaConnection() {
  primaryConnection ??= new Connection(resolveSolanaRpcUrl(), { commitment: env.SOLANA_COMMITMENT, wsEndpoint: resolveSolanaWsUrl() });
  return primaryConnection;
}
export function getSolanaFallbackConnection() {
  const url = resolveSolanaFallbackRpcUrl();
  if (!url) return null;
  fallbackConnection ??= new Connection(url, { commitment: env.SOLANA_COMMITMENT, wsEndpoint: resolveSolanaFallbackWsUrl() });
  return fallbackConnection;
}

function circuitOpen(state: CircuitState) { return state.openUntil > Date.now(); }
function markSuccess(state: CircuitState) { state.consecutiveFailures = 0; state.openUntil = 0; }
function markFailure(state: CircuitState) {
  state.consecutiveFailures += 1;
  if (state.consecutiveFailures >= env.SOLANA_RPC_FAILURE_THRESHOLD) state.openUntil = Date.now() + env.SOLANA_RPC_COOLDOWN_MS;
}
async function attempt<T>(connection: Connection, state: CircuitState, operation: (connection: Connection) => Promise<T>) {
  if (circuitOpen(state)) throw new AppError("solana_rpc_circuit_open", "Solana RPC provider is cooling down after repeated failures.", 503);
  try { const value = await operation(connection); markSuccess(state); return value; }
  catch (error) { markFailure(state); throw error; }
}

export async function withRpcFallback<T>(operation: (connection: Connection) => Promise<T>) {
  const primary = getSolanaConnection();
  if (!circuitOpen(primaryCircuit)) {
    try { return await attempt(primary, primaryCircuit, operation); } catch { /* fallback below */ }
  }
  const fallback = getSolanaFallbackConnection();
  if (fallback && !circuitOpen(fallbackCircuit)) {
    try { return await attempt(fallback, fallbackCircuit, operation); } catch { /* mapped below */ }
  }
  throw new AppError("solana_rpc_unavailable", "Solana RPC is temporarily unavailable.", 503);
}

export function solanaRpcInfo() {
  const primary = resolveSolanaRpcUrl();
  const isHelius = primary.includes("helius-rpc.com");
  return {
    cluster: env.SOLANA_CLUSTER,
    provider: isHelius ? "helius" : env.SOLANA_RPC_PROVIDER === "auto" ? "solana" : env.SOLANA_RPC_PROVIDER,
    endpoint: redactUrl(primary),
    websocketEndpoint: redactUrl(resolveSolanaWsUrl()),
    fallbackConfigured: Boolean(resolveSolanaFallbackRpcUrl()),
    heliusApiConfigured: Boolean(env.HELIUS_API_KEY || env.HELIUS_RPC_URL)
  };
}
export function getSolanaFallbackHealth(): SolanaFallbackHealth {
  const info = solanaRpcInfo();
  const fallback = resolveSolanaFallbackRpcUrl();
  return {
    primary: {
      provider: info.provider,
      endpoint: info.endpoint,
      openUntil: primaryCircuit.openUntil > Date.now() ? new Date(primaryCircuit.openUntil).toISOString() : null,
      consecutiveFailures: primaryCircuit.consecutiveFailures
    },
    fallback: {
      configured: Boolean(fallback),
      ...(fallback ? { endpoint: redactUrl(fallback) } : {}),
      openUntil: fallbackCircuit.openUntil > Date.now() ? new Date(fallbackCircuit.openUntil).toISOString() : null,
      consecutiveFailures: fallbackCircuit.consecutiveFailures
    }
  };
}
export function getHeliusRpcUrl() { return derivedHeliusRpcUrl(); }
