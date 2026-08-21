import type { MarketAsset, MarketPrice } from "@powerchain/types";
import { env } from "../../env/index.js";
import { AppError } from "../../common/errors.js";
import { fetchJson } from "../../common/utils/helpers.js";

type PythResponse = { parsed?: Array<{ id?: string; price?: { price?: string; conf?: string; expo?: number; publish_time?: number } }> };

export async function fetchPythPrice(asset: MarketAsset): Promise<MarketPrice> {
  if (!asset.pythFeedId) throw new AppError("pyth_feed_unavailable", `No Pyth feed is configured for ${asset.symbol}.`, 404);
  const url = new URL(`${env.PYTH_HERMES_URL.replace(/\/$/, "")}/v2/updates/price/latest`);
  url.searchParams.append("ids[]", asset.pythFeedId);
  url.searchParams.set("parsed", "true");
  const headers: Record<string, string> = { accept: "application/json" };
  if (env.PYTH_API_KEY) headers.authorization = `Bearer ${env.PYTH_API_KEY}`;
  const payload = await fetchJson<PythResponse>(url, { headers, timeoutMs: 8_000 });
  const update = payload.parsed?.[0]?.price;
  if (!update?.price || typeof update.expo !== "number") throw new AppError("pyth_invalid_response", "Pyth returned no parsed price.", 502);
  const usd = Number(update.price) * 10 ** update.expo;
  const confidence = update.conf ? Number(update.conf) * 10 ** update.expo : null;
  const publishMs = (update.publish_time || Math.floor(Date.now() / 1000)) * 1000;
  if (!Number.isFinite(usd) || usd <= 0) throw new AppError("pyth_invalid_price", "Pyth returned an invalid price.", 502);
  return { symbol: asset.symbol, usd, source: "pyth", confidence, publishTime: new Date(publishMs).toISOString(), stale: Date.now() - publishMs > 90_000 };
}
