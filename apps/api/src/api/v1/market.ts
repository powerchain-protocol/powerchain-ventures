import { Router } from "express";
import { z } from "zod";
import type { MarketBatchResult, MarketDataSource } from "@powerchain/types";
import { badRequest, ok } from "../../common/response.js";
import { getMarketPrice, getMarketProviderHealth } from "../../market/market-service.js";
import { AppError } from "../../common/errors.js";

export const marketRouter = Router();
const sourceSchema = z.enum(["pyth", "birdeye", "coingecko"]);
const querySchema = z.object({
  symbol: z.string().min(1).max(12).optional(),
  mint: z.string().min(32).max(64).optional(),
  pythFeedId: z.string().max(80).optional(),
  coingeckoId: z.string().max(100).optional(),
  source: sourceSchema.optional(),
  fallback: z.enum(["true", "false"]).optional(),
  refresh: z.enum(["true", "false"]).optional()
});
const batchSchema = z.object({
  symbols: z.string().min(1).max(200),
  source: sourceSchema.optional(),
  fallback: z.enum(["true", "false"]).optional(),
  refresh: z.enum(["true", "false"]).optional()
});

marketRouter.get("/price", async (req, res, next) => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) return badRequest(res, "invalid_query", parsed.error.issues);
    return ok(res, await getMarketPrice({
      ...parsed.data,
      refresh: parsed.data.refresh === "true",
      allowFallback: parsed.data.fallback !== "false"
    }));
  } catch (error) { next(error); }
});

marketRouter.get("/prices", async (req, res, next) => {
  try {
    const parsed = batchSchema.safeParse(req.query);
    if (!parsed.success) return badRequest(res, "invalid_query", parsed.error.issues);
    const symbols = [...new Set(parsed.data.symbols.split(",").map((value) => value.trim().toUpperCase()).filter(Boolean))].slice(0, 12);
    if (!symbols.length) return badRequest(res, "symbols_required", undefined, "At least one market symbol is required.");
    const prices: MarketBatchResult["prices"] = [];
    const unavailable: MarketBatchResult["unavailable"] = [];
    await Promise.all(symbols.map(async (symbol) => {
      try {
        prices.push(await getMarketPrice({ symbol, source: parsed.data.source as MarketDataSource | undefined, refresh: parsed.data.refresh === "true", allowFallback: parsed.data.fallback !== "false" }));
      } catch (error) {
        unavailable.push({ symbol, code: error instanceof AppError ? error.code : "market_data_unavailable" });
      }
    }));
    const data: MarketBatchResult = { prices, unavailable };
    return ok(res, data);
  } catch (error) { next(error); }
});

marketRouter.get("/providers", async (_req, res, next) => {
  try { return ok(res, await getMarketProviderHealth()); } catch (error) { next(error); }
});
