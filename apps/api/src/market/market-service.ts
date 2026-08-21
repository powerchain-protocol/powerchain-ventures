import type { MarketDataSource, MarketPrice, MarketPriceResult, MarketProviderHealth } from "@powerchain/types";
import { env, marketProviderOrder } from "../env/index.js";
import { cache, cached } from "../cache/cache.js";
import { AppError } from "../common/errors.js";
import { resolveMarketAsset } from "./assets.js";
import { fetchPythPrice } from "./providers/pyth.js";
import { fetchBirdeyePrice } from "./providers/birdeye.js";
import { fetchCoinGeckoPrice } from "./providers/coingecko.js";

const loaders: Record<MarketDataSource, typeof fetchPythPrice> = { pyth: fetchPythPrice, birdeye: fetchBirdeyePrice, coingecko: fetchCoinGeckoPrice };

export async function getMarketPrice(input: {
  symbol?: string; mint?: string; pythFeedId?: string; coingeckoId?: string; refresh?: boolean; source?: MarketDataSource; allowFallback?: boolean;
}): Promise<MarketPriceResult> {
  const asset = resolveMarketAsset(input);
  const configuredOrder = marketProviderOrder.length ? marketProviderOrder : (["pyth", "birdeye", "coingecko"] as MarketDataSource[]);
  const order = input.source
    ? [input.source, ...(input.allowFallback === false ? [] : configuredOrder.filter((source) => source !== input.source))]
    : configuredOrder;
  const key = `price:${asset.symbol}:${asset.mint || ""}:${asset.pythFeedId || ""}:${order.join(",")}`;
  if (input.refresh) cache.delete(key);
  return cached(key, env.POWERCHAIN_CACHE_TTL_MS, async () => {
    const attemptedSources: MarketDataSource[] = [];
    for (const source of order) {
      attemptedSources.push(source);
      try {
        const price = await loaders[source](asset);
        return { price, attemptedSources, fallbackUsed: attemptedSources.length > 1 };
      } catch {
        // Provider failures are isolated so configured fallbacks remain available.
      }
    }
    throw new AppError("market_data_unavailable", `No market-data provider returned a price for ${asset.symbol}.`, 503);
  });
}

export async function getMarketProviderHealth(): Promise<MarketProviderHealth[]> {
  const checks: Array<[MarketDataSource, boolean]> = [
    ["pyth", Boolean(env.PYTH_HERMES_URL)],
    ["birdeye", Boolean(env.BIRDEYE_API_KEY)],
    ["coingecko", Boolean(env.COINGECKO_BASE_URL)]
  ];
  return Promise.all(checks.map(async ([source, configured]) => {
    if (!configured) return { source, configured, healthy: false };
    const started = performance.now();
    try {
      const price: MarketPrice = await loaders[source](resolveMarketAsset({ symbol: "SOL" }));
      void price;
      return { source, configured, healthy: true, latencyMs: Math.round(performance.now() - started) };
    } catch (error) {
      return { source, configured, healthy: false, latencyMs: Math.round(performance.now() - started), error: error instanceof Error ? error.message : "provider_error" };
    }
  }));
}
