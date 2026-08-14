import { parseClientRuntimeConfig, type ClientRuntimeConfig } from "./env/public";

/** Browser-safe, build-time public configuration only. No server secrets. */
const clientConfig: ClientRuntimeConfig = parseClientRuntimeConfig({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SOLANA_CLUSTER: process.env.NEXT_PUBLIC_SOLANA_CLUSTER,
  NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
});

/** Stable singleton used by client providers and hooks. */
export function getClientConfig(): ClientRuntimeConfig {
  return clientConfig;
}

export { clientConfig };
export type { ClientRuntimeConfig };
