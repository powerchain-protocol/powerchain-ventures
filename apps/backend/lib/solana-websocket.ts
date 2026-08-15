import type { SolanaCluster } from "@powerchain/launchpad-config/rpc";

function cluster(): SolanaCluster {
  return process.env.NEXT_PUBLIC_SOLANA_CLUSTER?.trim() ===
    "devnet"
    ? "devnet"
    : "mainnet-beta";
}

function heliusWss(
  network: SolanaCluster,
  apiKey: string,
): string {
  const host =
    network === "devnet"
      ? "devnet.helius-rpc.com"
      : "mainnet.helius-rpc.com";
  const url = new URL(`wss://${host}/`);
  url.searchParams.set("api-key", apiKey);
  return url.toString();
}

function parseWebSocketUrls(
  value: string | undefined,
): string[] {
  if (!value?.trim()) return [];

  return value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const url = new URL(item);
      if (
        url.protocol !== "wss:" &&
        url.protocol !== "ws:"
      ) {
        throw new Error(
          `Invalid WebSocket endpoint: ${item}`,
        );
      }
      if (
        process.env.NODE_ENV === "production" &&
        url.protocol !== "wss:"
      ) {
        throw new Error(
          "Production WebSocket endpoints must use wss",
        );
      }
      return url.toString();
    });
}

function safeLabel(value: string): string {
  const url = new URL(value);
  if (url.searchParams.has("api-key")) {
    url.searchParams.set("api-key", "REDACTED");
  }
  return url.toString();
}

export function serverWebSocketEndpoints(): string[] {
  const values: string[] = [];
  const heliusKey = process.env.HELIUS_API_KEY?.trim();

  if (heliusKey) {
    values.push(heliusWss(cluster(), heliusKey));
  }

  values.push(
    ...parseWebSocketUrls(
      process.env.CUSTOM_SOLANA_WS_URLS,
    ),
  );

  const legacy = process.env.SOLANA_WS_URL?.trim();
  if (legacy) {
    values.push(...parseWebSocketUrls(legacy));
  }

  const unique = new Map<string, string>();
  for (const value of values) {
    const url = new URL(value);
    const key =
      `${url.protocol}//${url.host}${url.pathname}`;
    if (!unique.has(key)) unique.set(key, value);
  }
  return [...unique.values()];
}

export function websocketTransportStatus() {
  const endpoints = serverWebSocketEndpoints();

  return {
    configured: endpoints.length > 0,
    endpointCount: endpoints.length,
    endpoints: endpoints.map((value, index) => ({
      index,
      primary: index === 0,
      url: safeLabel(value),
    })),
    reconnect: {
      strategy: "exponential",
      baseMs: 1_000,
      maxMs: 30_000,
    },
    healthIntervalMs: 60_000,
    fallback: "http-rpc",
  };
}
