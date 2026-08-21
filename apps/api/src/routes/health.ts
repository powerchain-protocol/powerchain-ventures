import { Router } from "express";
import { APP } from "../constants/app.js";
import { env } from "../lib/env.js";
import { ok } from "../common/response.js";
import { solanaRpcInfo } from "../lib/solana-rpc.js";

export const healthRouter = Router();
healthRouter.get("/health", (req, res) => ok(res, {
  ok: true,
  app: APP.name,
  service: APP.service,
  network: env.SOLANA_CLUSTER,
  dataMode: env.POWERCHAIN_DATA_MODE,
  auth: "better-auth",
  turnstile: Boolean(env.TURNSTILE_SECRET_KEY),
  rpc: solanaRpcInfo(),
  requestId: req.requestId
}));
healthRouter.get("/health/live", (_req, res) => ok(res, { ok: true }));
healthRouter.get("/health/ready", async (_req, res) => {
  if (!env.DATABASE_URL) return ok(res, { ok: true, database: "not_configured", mode: env.POWERCHAIN_DATA_MODE, auth: "unavailable_without_database", rpc: solanaRpcInfo() });
  try {
    const { prisma } = await import("../lib/prisma.js");
    await prisma.$queryRaw`SELECT 1`;
    return ok(res, { ok: true, database: "ready", auth: "ready", mode: env.POWERCHAIN_DATA_MODE, rpc: solanaRpcInfo() });
  } catch {
    return res.status(503).json({ error: { code: "not_ready", message: "Database-backed authentication is not ready" } });
  }
});
