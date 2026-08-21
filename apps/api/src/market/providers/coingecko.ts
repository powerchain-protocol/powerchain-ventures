import type { MarketAsset, MarketPrice } from "@powerchain/types";
import { env } from "../../env/index.js";
import { AppError } from "../../common/errors.js";
import { fetchJson } from "../../common/utils/helpers.js";

type CoinGeckoPayload = Record<string, { usd?: number; usd_24h_change?: number; last_updated_at?: number }>;

export async function fetchCoinGeckoPrice(asset: MarketAsset): Promise<MarketPrice> {
  if (!asset.coingeckoId) throw new AppError("coingecko_id_unavailable", `No CoinGecko ID is configured for ${asset.symbol}.`, 404);
  const url = new URL(`${env.COINGECKO_BASE_URL.replace(/\/$/, "")}/simple/price`);
  url.searchParams.set("ids", asset.coingeckoId);
  url.searchParams.set("vs_currencies", "usd");
  url.searchParams.set("include_24hr_change", "true");
  url.searchParams.set("include_last_updated_at", "true");
  const headers: Record<string, string> = { accept: "application/json" };
  if (env.COINGECKO_API_KEY) headers[env.COINGECKO_PLAN === "pro" ? "x-cg-pro-api-key" : "x-cg-demo-api-key"] = env.COINGECKO_API_KEY;
  const payload = await fetchJson<CoinGeckoPayload>(url, { headers, timeoutMs: 8_000 });
  const row = payload[asset.coingeckoId];
  if (!row?.usd || !Number.isFinite(row.usd)) throw new AppError("coingecko_price_unavailable", "CoinGecko returned no price for this asset.", 502);
  const publishMs = (row.last_updated_at || Math.floor(Date.now() / 1000)) * 1000;
  return { symbol: asset.symbol, usd: row.usd, source: "coingecko", change24h: row.usd_24h_change ?? null, publishTime: new Date(publishMs).toISOString(), stale: Date.now() - publishMs > 180_000 };
}
