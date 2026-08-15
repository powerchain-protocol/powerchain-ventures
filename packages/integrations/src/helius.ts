import {
  fetchIntegrationJson,
  type IntegrationRequestOptions,
} from "./http.js";

export const HELIUS_MAINNET_RPC_BASE =
  "https://mainnet.helius-rpc.com/" as const;
export const HELIUS_API_BASE =
  "https://api.helius.xyz" as const;

export function heliusRpcUrl(
  apiKey: string,
  base:
    string =
    HELIUS_MAINNET_RPC_BASE,
) {
  if (!apiKey.trim()) {
    throw new Error(
      "helius_api_key_required",
    );
  }

  const url = new URL(base);
  url.searchParams.set(
    "api-key",
    apiKey.trim(),
  );
  return url.toString();
}

export async function heliusRpc<T>(
  input: {
    apiKey: string;
    method: string;
    params?: unknown[];
    rpcBase?: string;
  },
  options:
    IntegrationRequestOptions = {},
) {
  const body = {
    jsonrpc: "2.0",
    id: crypto.randomUUID(),
    method: input.method,
    params: input.params ?? [],
  };

  const result =
    await fetchIntegrationJson<{
      result?: T;
      error?: {
        code: number;
        message: string;
      };
    }>(
      heliusRpcUrl(
        input.apiKey,
        input.rpcBase,
      ),
      {
        method: "POST",
        headers: {
          "content-type":
            "application/json",
        },
        body: JSON.stringify(
          body,
        ),
      },
      options,
    );

  if (result.error) {
    throw new Error(
      `helius_rpc_${result.error.code}:${result.error.message}`,
    );
  }

  if (
    result.result ===
    undefined
  ) {
    throw new Error(
      "helius_rpc_missing_result",
    );
  }

  return result.result;
}
