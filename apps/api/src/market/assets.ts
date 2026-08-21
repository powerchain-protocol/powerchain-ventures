import type { MarketAsset } from "@powerchain/types";
import { env } from "../env/index.js";

const ASSETS: Record<string, MarketAsset> = {
  SOL: { symbol: "SOL", mint: "So11111111111111111111111111111111111111112", pythFeedId: env.PYTH_SOL_USD_FEED_ID, coingeckoId: "solana" },
  USDC: { symbol: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", coingeckoId: "usd-coin" },
  PWRC: { symbol: "PWRC", mint: "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc" }
};

export function resolveMarketAsset(input: { symbol?: string; mint?: string; pythFeedId?: string; coingeckoId?: string }): MarketAsset {
  const symbol = (input.symbol || "").trim().toUpperCase();
  const known = symbol ? ASSETS[symbol] : undefined;
  return {
    symbol: symbol || known?.symbol || "TOKEN",
    mint: input.mint || known?.mint,
    pythFeedId: input.pythFeedId || known?.pythFeedId,
    coingeckoId: input.coingeckoId || known?.coingeckoId
  };
}
