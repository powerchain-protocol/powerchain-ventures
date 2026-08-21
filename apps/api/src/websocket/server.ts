import type { Server } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { fromNodeHeaders } from "better-auth/node";
import type { RealtimeStatus } from "@powerchain/types";
import { auth } from "../auth/auth.js";
import { corsOrigins, env } from "../env/index.js";
import { getMarketPrice } from "../market/market-service.js";
import { launchRepository } from "../repositories/launch-repository.js";

const HEARTBEAT_MS = 30_000;
const MARKET_BROADCAST_MS = Math.max(env.POWERCHAIN_CACHE_TTL_MS, 10_000);
const clients = new Map<WebSocket, { channels: Set<string>; ip: string; alive: boolean; userId: string | null }>();
const maxConnectionsPerIp = 8;

function send(socket: WebSocket, payload: unknown) {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload));
}

function clientIp(request: import("node:http").IncomingMessage) {
  if (env.TRUST_CLOUDFLARE_PROXY) return String(request.headers["cf-connecting-ip"] || request.socket.remoteAddress || "unknown");
  return request.socket.remoteAddress || "unknown";
}

function connectionCount(ip: string) {
  let count = 0;
  for (const state of clients.values()) if (state.ip === ip) count += 1;
  return count;
}

async function broadcastMarket(channel: string) {
  const symbol = channel.split(":")[1] || "SOL";
  try {
    const data = await getMarketPrice({ symbol });
    for (const [socket, state] of clients) if (state.channels.has(channel)) send(socket, { type: "market.price", channel, data, at: new Date().toISOString() });
  } catch {
    // Keep sockets open; every ready payload advertises the REST fallback.
  }
}

async function authorizeChannel(channel: string, userId: string | null) {
  if (channel.startsWith("market:")) return true;
  if (!channel.startsWith("launch:") || !userId) return false;
  const launchId = channel.slice("launch:".length);
  return launchRepository.canManage(launchId, userId);
}

export function attachWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/v1/ws", maxPayload: 32 * 1024, perMessageDeflate: false });
  wss.on("connection", (socket, request) => {
    const origin = request.headers.origin;
    if (origin && !corsOrigins.includes(origin)) { socket.close(1008, "origin_not_allowed"); return; }
    const ip = clientIp(request);
    if (connectionCount(ip) >= maxConnectionsPerIp) { socket.close(1013, "connection_limit"); return; }

    const state = { channels: new Set<string>(), ip, alive: true, userId: null as string | null };
    clients.set(socket, state);
    void auth.api.getSession({ headers: fromNodeHeaders(request.headers) })
      .then((session) => { if (clients.has(socket)) state.userId = session?.user.id ?? null; })
      .catch(() => undefined);

    send(socket, {
      type: "ready",
      version: "v1",
      heartbeatMs: HEARTBEAT_MS,
      fallback: "/api/v1/market/price",
      channels: { public: "market:<SYMBOL>", protected: "launch:<launchId>" }
    });

    socket.on("pong", () => { const current = clients.get(socket); if (current) current.alive = true; });
    socket.on("message", (raw) => {
      void (async () => {
        try {
          const message = JSON.parse(raw.toString()) as { type?: string; channels?: unknown };
          if (message.type === "subscribe" && Array.isArray(message.channels)) {
            const accepted: string[] = [];
            const denied: string[] = [];
            for (const channel of message.channels.filter((value): value is string => typeof value === "string").slice(0, 20)) {
              if (!/^(market:[A-Z0-9_-]{2,12}|launch:[a-zA-Z0-9_-]{1,80})$/.test(channel)) { denied.push(channel); continue; }
              if (await authorizeChannel(channel, state.userId)) { state.channels.add(channel); accepted.push(channel); }
              else denied.push(channel);
            }
            send(socket, { type: "subscribed", channels: [...state.channels], accepted, denied });
          } else if (message.type === "unsubscribe" && Array.isArray(message.channels)) {
            for (const channel of message.channels) if (typeof channel === "string") state.channels.delete(channel);
            send(socket, { type: "subscribed", channels: [...state.channels] });
          } else if (message.type === "ping") send(socket, { type: "pong", at: Date.now() });
          else send(socket, { type: "error", code: "unsupported_message" });
        } catch { send(socket, { type: "error", code: "invalid_message" }); }
      })();
    });
    socket.on("close", () => clients.delete(socket));
    socket.on("error", () => clients.delete(socket));
  });

  const marketTimer = setInterval(() => {
    const channels = new Set<string>();
    for (const state of clients.values()) for (const channel of state.channels) if (channel.startsWith("market:")) channels.add(channel);
    for (const channel of channels) void broadcastMarket(channel);
  }, MARKET_BROADCAST_MS);
  marketTimer.unref();

  const heartbeat = setInterval(() => {
    for (const [socket, state] of clients) {
      if (socket.readyState !== WebSocket.OPEN) continue;
      if (!state.alive) { socket.terminate(); clients.delete(socket); continue; }
      state.alive = false;
      socket.ping();
    }
  }, HEARTBEAT_MS);
  heartbeat.unref();
  wss.on("close", () => { clearInterval(marketTimer); clearInterval(heartbeat); clients.clear(); });
  return wss;
}

export function publishLaunchEvent(launchId: string, event: { type: string; data?: Record<string, unknown> }) {
  const channel = `launch:${launchId}`;
  for (const [socket, state] of clients) if (state.channels.has(channel)) send(socket, { ...event, channel, at: new Date().toISOString() });
}

export function getRealtimeStatus(): RealtimeStatus {
  let subscriptions = 0;
  for (const state of clients.values()) subscriptions += state.channels.size;
  return {
    path: "/api/v1/ws",
    clients: clients.size,
    subscriptions,
    heartbeatMs: HEARTBEAT_MS,
    marketBroadcastMs: MARKET_BROADCAST_MS,
    restFallback: "/api/v1/market/price"
  };
}
