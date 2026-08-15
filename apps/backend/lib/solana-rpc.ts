import {
  parseCsvUrls,
  parseRpcProvider,
  resolveServerRpcUrls,
  type SolanaCluster,
} from "@powerchain/launchpad-config/rpc";

type RpcEnvelope<T> = {
  result?: T;
  error?: { code?: number; message?: string };
};

export type RpcAttempt = {
  url: string;
  latencyMs: number;
  ok: boolean;
  error?: string;
};

function cluster(): SolanaCluster {
  const value = process.env.NEXT_PUBLIC_SOLANA_CLUSTER?.trim();
  return value === "devnet" ? "devnet" : "mainnet-beta";
}

function configuredUrls(): string[] {
  return resolveServerRpcUrls({
    cluster: cluster(),
    provider: parseRpcProvider(process.env.SOLANA_RPC_PROVIDER),
    heliusApiKey: process.env.HELIUS_API_KEY,
    heliusRpcBaseUrl: process.env.HELIUS_RPC_URL,
    customPrimaryUrl: process.env.CUSTOM_SOLANA_RPC_URL,
    customFallbackUrls: parseCsvUrls(
      process.env.CUSTOM_SOLANA_RPC_FALLBACK_URLS,
    ),
    legacyPrimaryUrl: process.env.SOLANA_RPC_URL,
    legacyFallbackUrl: process.env.SOLANA_RPC_FALLBACK_URL,
    legacyFallbackUrls: parseCsvUrls(
      process.env.SOLANA_RPC_FALLBACK_URLS,
    ),
    allowPublicFallback: process.env.NODE_ENV !== "production",
  });
}

function safeRpcLabel(value: string): string {
  try {
    const url = new URL(value);
    if (url.searchParams.has("api-key")) {
      url.searchParams.set("api-key", "REDACTED");
    }
    return url.toString();
  } catch {
    return "configured-rpc";
  }
}

export function rpcEndpoints() {
  return configuredUrls().map((url, index) => ({
    url: safeRpcLabel(url),
    index,
    primary: index === 0,
  }));
}

export async function solanaRpc<T>(
  method: string,
  params: unknown[] = [],
): Promise<{
  result: T;
  endpoint: string;
  latencyMs: number;
  attempts: RpcAttempt[];
}> {
  const urls = configuredUrls();
  const attempts: RpcAttempt[] = [];
  let last = "rpc_unavailable";

  for (const url of urls) {
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8_000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: crypto.randomUUID(),
          method,
          params,
        }),
        signal: controller.signal,
        cache: "no-store",
      });

      const latencyMs = Date.now() - started;
      if (!response.ok) {
        last = `RPC HTTP ${response.status}`;
        attempts.push({
          url: safeRpcLabel(url),
          latencyMs,
          ok: false,
          error: last,
        });
        continue;
      }

      const payload = await response.json() as RpcEnvelope<T>;
      if (payload.error) {
        last =
          payload.error.message ??
          `RPC error ${payload.error.code ?? "unknown"}`;
        attempts.push({
          url: safeRpcLabel(url),
          latencyMs,
          ok: false,
          error: last,
        });
        continue;
      }
      if (payload.result === undefined) {
        last = "RPC response missing result";
        attempts.push({
          url: safeRpcLabel(url),
          latencyMs,
          ok: false,
          error: last,
        });
        continue;
      }

      attempts.push({
        url: safeRpcLabel(url),
        latencyMs,
        ok: true,
      });

      return {
        result: payload.result,
        endpoint: safeRpcLabel(url),
        latencyMs,
        attempts,
      };
    } catch (error) {
      const latencyMs = Date.now() - started;
      last =
        error instanceof Error ? error.message : "RPC request failed";
      attempts.push({
        url: safeRpcLabel(url),
        latencyMs,
        ok: false,
        error: last,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  throw Object.assign(new Error(last), { attempts });
}

export async function rpcHealth() {
  try {
    const health = await solanaRpc<string>("getHealth");
    return {
      ok: health.result === "ok",
      endpoint: health.endpoint,
      latencyMs: health.latencyMs,
      attempts: health.attempts,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "RPC unavailable",
      attempts:
        (error as { attempts?: RpcAttempt[] })?.attempts ?? [],
    };
  }
}
