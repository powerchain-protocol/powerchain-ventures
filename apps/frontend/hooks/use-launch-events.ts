"use client";

import { useEffect, useState } from "react";
import type { CampaignLifecycleEvent } from "@powerchain/types";
import { SITE } from "@/constants/site";

function wsUrl() {
  try {
    const url = new URL(SITE.urls.api);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/api/v1/ws";
    url.search = "";
    return url.toString();
  } catch { return ""; }
}

export function useLaunchEvents(launchId: string) {
  const [event, setEvent] = useState<CampaignLifecycleEvent | null>(null);
  const [transport, setTransport] = useState<"websocket" | "rest">("rest");
  useEffect(() => {
    if (!launchId) return;
    let socket: WebSocket | undefined;
    const url = wsUrl();
    if (!url) return;
    try {
      socket = new WebSocket(url);
      socket.addEventListener("open", () => {
        setTransport("websocket");
        socket?.send(JSON.stringify({ type: "subscribe", channels: [`launch:${launchId}`] }));
      });
      socket.addEventListener("message", (message) => {
        try {
          const value = JSON.parse(String(message.data)) as { type?: string; channel?: string; at?: string; data?: Record<string, unknown> };
          if (value.channel !== `launch:${launchId}` || !value.type || !value.at) return;
          setEvent({ id: `${launchId}:${value.at}:${value.type}`, launchId, type: value.type, createdAt: value.at, data: value.data });
        } catch { /* Ignore malformed upstream frames. */ }
      });
      socket.addEventListener("close", () => setTransport("rest"));
      socket.addEventListener("error", () => setTransport("rest"));
    } catch { setTransport("rest"); }
    return () => socket?.close();
  }, [launchId]);
  return { event, transport };
}
