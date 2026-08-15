import {
  SolanaWebSocketClient,
} from "@powerchain/solana/websocket";
import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "./endpoints";

export type RealtimeMode =
  | "websocket"
  | "polling";

function publicWebSocketUrls(): string[] {
  const raw =
    process.env.NEXT_PUBLIC_SOLANA_WS_URL?.trim();
  if (!raw) return [];

  return raw
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const url = new URL(item);
      if (
        url.protocol !== "ws:" &&
        url.protocol !== "wss:"
      ) {
        throw new Error(
          "NEXT_PUBLIC_SOLANA_WS_URL must use ws or wss",
        );
      }
      if (
        process.env.NODE_ENV === "production" &&
        url.protocol !== "wss:"
      ) {
        throw new Error(
          "Production public WebSocket must use wss",
        );
      }
      return url.toString();
    });
}

export function createRealtimeService() {
  const endpoints = publicWebSocketUrls();

  const client = endpoints.length
    ? new SolanaWebSocketClient({
        endpoints,
        reconnectBaseMs: 1_000,
        reconnectMaxMs: 30_000,
        healthIntervalMs: 60_000,
      })
    : null;

  return {
    mode(): RealtimeMode {
      return client ? "websocket" : "polling";
    },

    connect() {
      client?.connect();
    },

    close() {
      client?.close();
    },

    onSignature(
      signature: string,
      listener: (value: unknown) => void,
    ): () => void {
      if (!client) return () => {};
      client.connect();

      return client.subscribe(
        "signatureSubscribe",
        [
          signature,
          { commitment: "finalized" },
        ],
        listener,
      );
    },

    pollTransportStatus() {
      return apiClient.get<{
        transport: {
          http: {
            rpcEndpoints?: unknown[];
          };
          websocket: {
            configured?: boolean;
          };
        };
      }>(
        API_ENDPOINTS.transportStatus,
        {
          timeoutMs: 8_000,
          retries: 1,
        },
      );
    },
  };
}

export const realtimeService =
  createRealtimeService();
