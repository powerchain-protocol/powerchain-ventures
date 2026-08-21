import { Router } from "express";
import { ok } from "../../common/response.js";
import { env, marketProviderOrder } from "../../env/index.js";
import { getMarketProviderHealth } from "../../market/market-service.js";
import { getSolanaFallbackHealth, resolveSolanaFallbackRpcUrl, solanaRpcInfo } from "../../lib/solana-rpc.js";
import { redactUrl } from "../../common/utils/helpers.js";
import { getRealtimeStatus } from "../../websocket/server.js";

export const systemRouter = Router();
const startedAt = new Date();

systemRouter.get("/runtime", (_req, res) => ok(res, {
  service: "powerchain-api",
  version: "1.6.0",
  environment: env.NODE_ENV,
  dataMode: env.POWERCHAIN_DATA_MODE,
  cluster: env.SOLANA_CLUSTER,
  websocket: "/api/v1/ws",
  launchProgramConfigured: Boolean(env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID),
  startedAt: startedAt.toISOString(),
  uptimeSeconds: Math.floor(process.uptime())
}));

systemRouter.get("/fallbacks", async (_req, res, next) => {
  try {
    const rpc = solanaRpcInfo();
    const fallback = resolveSolanaFallbackRpcUrl();
    return ok(res, {
      solana: {
        primary: rpc.endpoint,
        websocket: rpc.websocketEndpoint,
        fallbackConfigured: rpc.fallbackConfigured,
        ...(fallback ? { fallback: redactUrl(fallback) } : {}),
        circuit: getSolanaFallbackHealth()
      },
      market: { order: marketProviderOrder, providers: await getMarketProviderHealth() },
      realtime: getRealtimeStatus()
    });
  } catch (error) { next(error); }
});

systemRouter.get("/realtime", (_req, res) => ok(res, getRealtimeStatus()));
