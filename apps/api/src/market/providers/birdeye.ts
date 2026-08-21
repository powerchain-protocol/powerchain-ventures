import type { MarketAsset, MarketPrice } from "@powerchain/types";
import { env } from "../../env/index.js";
import { AppError } from "../../common/errors.js";
import { fetchJson } from "../../common/utils/helpers.js";

type BirdeyePayload = { success?: boolean; data?: { value?: number; updateUnixTime?: number; liquidity?: number; priceChange24hPercent?: number } | null };

export async function fetchBirdeyePrice(asset: MarketAsset): Promise<MarketPrice> {
  if (!env.BIRDEYE_API_KEY) throw new AppError("birdeye_not_configured", "Birdeye is not configured.", 503);
  if (!asset.mint) throw new AppError("birdeye_mint_required", `No Solana mint is configured for ${asset.symbol}.`, 404);
  const url = new URL(`${env.BIRDEYE_BASE_URL.replace(/\/$/, "")}/defi/price`);
  url.searchParams.set("address", asset.mint);
  url.searchParams.set("include_liquidity", "true");
  const payload = await fetchJson<BirdeyePayload>(url, { headers: { accept: "application/json", "X-API-KEY": env.BIRDEYE_API_KEY, "x-chain": "solana" }, timeoutMs: 8_000 });
  const value = payload.data?.value;
  if (!payload.success || !value || !Number.isFinite(value)) throw new AppError("birdeye_price_unavailable", "Birdeye returned no price for this token.", 502);
  const publishMs = (payload.data?.updateUnixTime || Math.floor(Date.now() / 1000)) * 1000;
  return { symbol: asset.symbol, usd: value, source: "birdeye", liquidityUsd: payload.data?.liquidity ?? null, change24h: payload.data?.priceChange24hPercent ?? null, publishTime: new Date(publishMs).toISOString(), stale: Date.now() - publishMs > 120_000 };
}
