export type SolanaCluster = "devnet" | "mainnet-beta";

export interface ClientRuntimeConfig {
  readonly appUrl: string;
  readonly solanaCluster: SolanaCluster;
  readonly solanaRpcUrl: string;
}

type PublicEnv = {
  readonly NODE_ENV?: string;
  readonly NEXT_PUBLIC_APP_URL?: string;
  readonly NEXT_PUBLIC_SOLANA_CLUSTER?: string;
  readonly NEXT_PUBLIC_SOLANA_RPC_URL?: string;
};

function required(source: PublicEnv, name: keyof PublicEnv): string {
  const value = source[name]?.trim();
  if (!value) throw new Error(`[PowerChain] ${String(name)} is required`);
  return value;
}

function absoluteHttpUrl(source: PublicEnv, name: "NEXT_PUBLIC_APP_URL" | "NEXT_PUBLIC_SOLANA_RPC_URL"): string {
  const value = required(source, name);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`[PowerChain] ${name} must be an absolute URL`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`[PowerChain] ${name} must use http or https`);
  }
  if (url.username || url.password) {
    throw new Error(`[PowerChain] ${name} must not contain URL credentials`);
  }
  if (source.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error(`[PowerChain] ${name} must use https in production`);
  }
  return url.toString().replace(/\/$/, "");
}

function solanaCluster(source: PublicEnv): SolanaCluster {
  const cluster = required(source, "NEXT_PUBLIC_SOLANA_CLUSTER");
  if (cluster !== "devnet" && cluster !== "mainnet-beta") {
    throw new Error("[PowerChain] NEXT_PUBLIC_SOLANA_CLUSTER must be devnet or mainnet-beta");
  }
  return cluster;
}

/**
 * Browser-only public runtime parser.
 *
 * Keep this module local to the frontend. It deliberately has no dependency on
 * workspace barrels, server-only modules, Node APIs, databases, or secrets.
 */
export function parseClientRuntimeConfig(source: PublicEnv): ClientRuntimeConfig {
  return Object.freeze({
    appUrl: absoluteHttpUrl(source, "NEXT_PUBLIC_APP_URL"),
    solanaCluster: solanaCluster(source),
    solanaRpcUrl: absoluteHttpUrl(source, "NEXT_PUBLIC_SOLANA_RPC_URL"),
  });
}
