import type {
  AggregatedPrice,
  PriceAsset,
  RateSnapshot,
} from "./types.js";

export function rateBetween(
  base: AggregatedPrice,
  quote: AggregatedPrice,
): RateSnapshot {
  if (
    !base.available ||
    !quote.available ||
    !base.priceUsd ||
    !quote.priceUsd
  ) {
    throw new Error(
      "rate_price_unavailable",
    );
  }

  return {
    base: base.asset,
    quote: quote.asset,
    rate:
      base.priceUsd /
      quote.priceUsd,
    observedAt:
      new Date().toISOString(),
    source: [
      ...new Set([
        ...base.sources.map(
          source =>
            source.provider,
        ),
        ...quote.sources.map(
          source =>
            source.provider,
        ),
      ]),
    ].join("+"),
  };
}

export function usdRate(
  price: AggregatedPrice,
): RateSnapshot {
  if (
    !price.available ||
    !price.priceUsd
  ) {
    throw new Error(
      "usd_rate_unavailable",
    );
  }

  return {
    base: price.asset,
    quote: "USD",
    rate: price.priceUsd,
    observedAt:
      price.observedAt,
    source: [
      ...new Set(
        price.sources.map(
          source =>
            source.provider,
        ),
      ),
    ].join("+"),
  };
}

export function inverseRate(
  rate: RateSnapshot,
): RateSnapshot {
  if (
    !Number.isFinite(rate.rate) ||
    rate.rate <= 0
  ) {
    throw new Error(
      "invalid_rate",
    );
  }

  return {
    base:
      rate.quote as PriceAsset,
    quote: rate.base,
    rate: 1 / rate.rate,
    observedAt:
      rate.observedAt,
    source: rate.source,
  };
}
