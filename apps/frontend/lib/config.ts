import { getPublicRuntimeConfig } from "@powerchain/launchpad-config";

/** Browser-safe, build-time public configuration only. No server secrets. */
export function getClientConfig() {
  return getPublicRuntimeConfig({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SOLANA_CLUSTER: process.env.NEXT_PUBLIC_SOLANA_CLUSTER,
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  });
}
