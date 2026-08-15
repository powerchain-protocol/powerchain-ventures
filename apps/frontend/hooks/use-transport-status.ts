"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  realtimeService,
  type RealtimeMode,
} from "../services/realtime-service";

type TransportStatus = {
  loading: boolean;
  mode: RealtimeMode;
  websocketConfigured: boolean;
  httpFallbacks: number;
  error: string | null;
};

export function useTransportStatus(
  refreshMs = 30_000,
): TransportStatus {
  const [state, setState] =
    useState<TransportStatus>({
      loading: true,
      mode: realtimeService.mode(),
      websocketConfigured: false,
      httpFallbacks: 0,
      error: null,
    });

  useEffect(() => {
    let live = true;

    async function refresh() {
      try {
        const data =
          await realtimeService.pollTransportStatus();

        if (!live) return;

        setState({
          loading: false,
          mode: realtimeService.mode(),
          websocketConfigured: Boolean(
            data.transport.websocket.configured,
          ),
          httpFallbacks: Math.max(
            0,
            (data.transport.http.rpcEndpoints
              ?.length ?? 1) - 1,
          ),
          error: null,
        });
      } catch (error) {
        if (!live) return;
        setState(current => ({
          ...current,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Transport status unavailable",
        }));
      }
    }

    void refresh();

    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }, Math.max(10_000, refreshMs));

    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [refreshMs]);

  return state;
}
