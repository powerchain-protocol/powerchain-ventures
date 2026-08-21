import { env } from "./env.js";
import { getHeliusRpcUrl } from "./solana-rpc.js";
import { AppError } from "../common/errors.js";

interface JsonRpcResponse<T> {
  jsonrpc: "2.0";
  id: string | number;
  result?: T;
  error?: { code: number; message: string; data?: unknown };
}

function requireHeliusUrl() {
  if (env.SOLANA_CLUSTER === "testnet") {
    throw new AppError("helius_network_unsupported", "Helius API methods in this service are configured for mainnet-beta or devnet.", 503);
  }
  const url = getHeliusRpcUrl();
  if (!url) throw new AppError("helius_not_configured", "Helius API is not configured on the server.", 503);
  return url;
}

export async function heliusRpc<T>(method: string, params: unknown): Promise<T> {
  const response = await fetch(requireHeliusUrl(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: crypto.randomUUID(), method, params }),
    signal: AbortSignal.timeout(12_000)
  });
  if (!response.ok) throw new AppError("helius_http_error", `Helius request failed with HTTP ${response.status}.`, response.status === 429 ? 429 : 502);
  const payload = await response.json() as JsonRpcResponse<T>;
  if (payload.error) {
    if (payload.error.code === -32005) throw new AppError("helius_rate_limited", "Helius request quota is temporarily exhausted.", 429);
    if (payload.error.code === -32001) throw new AppError("helius_not_authorized", "Helius server credentials are not authorized for this method.", 503);
    throw new AppError("helius_rpc_error", "Helius RPC returned an error.", 502);
  }
  if (payload.result === undefined) throw new AppError("helius_invalid_response", "Helius RPC returned no result.", 502);
  return payload.result;
}

export type HeliusAssetList = {
  total: number;
  limit: number;
  page: number;
  items: unknown[];
  last_indexed_slot?: number;
};

export function getAssetsByOwner(ownerAddress: string, page = 1, limit = 100) {
  return heliusRpc<HeliusAssetList>("getAssetsByOwner", {
    ownerAddress,
    page,
    limit,
    displayOptions: {
      showFungible: true,
      showNativeBalance: true
    }
  });
}

export type HeliusTransactionPage = {
  data: unknown[];
  paginationToken?: string | null;
};

export function getTransactionsForAddress(address: string, options: { limit?: number; full?: boolean; paginationToken?: string } = {}) {
  const full = options.full ?? false;
  const limit = Math.min(Math.max(options.limit ?? 50, 1), full ? 100 : 1000);
  return heliusRpc<HeliusTransactionPage>("getTransactionsForAddress", [
    address,
    {
      transactionDetails: full ? "full" : "signatures",
      sortOrder: "desc",
      commitment: "finalized",
      limit,
      filters: { tokenAccounts: "balanceChanged" },
      ...(full ? { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 } : {}),
      ...(options.paginationToken ? { paginationToken: options.paginationToken } : {})
    }
  ]);
}

export type HeliusTransferPage = {
  data: unknown[];
  paginationToken?: string | null;
};

export function getTransfersByAddress(address: string, options: {
  limit?: number;
  paginationToken?: string;
  direction?: "in" | "out" | "any";
  mint?: string;
  counterparty?: string;
  solMode?: "merged" | "separate";
} = {}) {
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 100);
  return heliusRpc<HeliusTransferPage>("getTransfersByAddress", [
    address,
    {
      limit,
      sortOrder: "desc",
      commitment: "finalized",
      direction: options.direction ?? "any",
      solMode: options.solMode ?? "merged",
      ...(options.mint ? { mint: options.mint } : {}),
      ...(options.counterparty ? { with: options.counterparty } : {}),
      ...(options.paginationToken ? { paginationToken: options.paginationToken } : {})
    }
  ]);
}

export function getAsset(assetId: string) {
  return heliusRpc<unknown>("getAsset", { id: assetId });
}
