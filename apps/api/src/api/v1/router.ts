import { Router } from "express";
import { accountRouter } from "../../routes/account.js";
import { eligibilityRouter } from "../../routes/eligibility.js";
import { healthRouter } from "../../routes/health.js";
import { launchesRouter } from "../../routes/launches.js";
import { solanaRouter } from "../../routes/solana.js";
import { transactionsRouter } from "../../routes/transactions.js";
import { campaignsRouter } from "./campaigns.js";
import { marketRouter } from "./market.js";
import { lifecycleRouter } from "./lifecycle.js";
import { systemRouter } from "./system.js";
import { marketRateLimit, writeRateLimit } from "../../middleware/rate-limit.js";

export const v1Router = Router();
v1Router.use(healthRouter);
v1Router.use("/account", accountRouter);
v1Router.use("/launches", launchesRouter);
v1Router.use("/campaigns", writeRateLimit, campaignsRouter);
v1Router.use("/eligibility", eligibilityRouter);
v1Router.use("/transactions", writeRateLimit, transactionsRouter);
v1Router.use("/solana", solanaRouter);
v1Router.use("/market", marketRateLimit, marketRouter);
v1Router.use("/lifecycle", lifecycleRouter);
v1Router.use("/system", systemRouter);

v1Router.get("/", (_req, res) => res.json({
  data: {
    version: "v1",
    endpoints: ["health", "account", "launches", "campaigns", "eligibility", "transactions", "solana", "market", "lifecycle", "system", "ws"],
    websocket: "/api/v1/ws"
  }
}));
