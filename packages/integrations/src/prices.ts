import {
  pythPrice,
} from "./pyth.js";
import {
  birdeyePrice,
} from "./birdeye.js";
import {
  coinMarketCapPrice,
} from "./coinmarketcap.js";
import {
  priceUsdToMicros,
} from "./amount.js";
import type {
  AggregatedPrice,
  PriceAsset,
  PriceObservation,
  PriceProvider,
  PriceProviderFailure,
} from "./types.js";

export type PriceSourceConfig = {
  pyth?: {
    apiKey?: string;
    baseUrl?: string;
    feedId?: string;
  };
  birdeye?: {
    apiKey?: string;
    baseUrl?: string;
    address?: string;
    chain?: "solana" | "sui";
  };
  coinmarketcap?: {
    apiKey?: string;
    baseUrl?: string;
    symbol?: string;
  };
};

export type FetchAggregatedPriceOptions = {
  maxAgeMs?: number;
  maxDivergenceBps?: number;
  timeoutMs?: number;
  providers?: readonly PriceProvider[];
};

function median(
  values: number[],
): number {
  const sorted =
    [...values].sort(
      (a, b) => a - b,
    );
  const middle =
    Math.floor(
      sorted.length / 2,
    );

  return sorted.length % 2
    ? sorted[middle]!
    : (
        sorted[middle - 1]! +
        sorted[middle]!
      ) / 2;
}

function sourceTime(
  source: PriceObservation,
) {
  const raw =
    source.sourceTimestamp ??
    source.observedAt;
  const value = Date.parse(raw);
  return Number.isFinite(value)
    ? value
    : 0;
}

function divergenceBps(
  sources: PriceObservation[],
) {
  if (sources.length < 2) {
    return 0;
  }

  const prices =
    sources.map(
      source =>
        source.priceUsd,
    );
  const low =
    Math.min(...prices);
  const high =
    Math.max(...prices);
  const mid =
    median(prices);

  if (mid <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.round(
    (
      (high - low) /
      mid
    ) * 10_000,
  );
}

export async function fetchAggregatedPrice(
  asset: PriceAsset,
  config: PriceSourceConfig,
  options: FetchAggregatedPriceOptions = {},
): Promise<AggregatedPrice> {
  const maxAgeMs =
    options.maxAgeMs ??
    90_000;
  const maxDivergence =
    options.maxDivergenceBps ??
    300;
  const providers =
    options.providers ??
    [
      "pyth",
      "birdeye",
      "coinmarketcap",
    ];

  const requests:
    Array<{
      provider: PriceProvider;
      promise:
        Promise<PriceObservation>;
    }> = [];

  if (
    providers.includes("pyth") &&
    config.pyth?.feedId &&
    config.pyth.apiKey
  ) {
    requests.push({
      provider: "pyth",
      promise: pythPrice(
        {
          asset,
          feedId:
            config.pyth.feedId,
          apiKey:
            config.pyth.apiKey,
          baseUrl:
            config.pyth.baseUrl,
        },
        {
          timeoutMs:
            options.timeoutMs,
        },
      ),
    });
  }

  if (
    providers.includes(
      "birdeye",
    ) &&
    config.birdeye?.apiKey &&
    config.birdeye.address
  ) {
    requests.push({
      provider: "birdeye",
      promise: birdeyePrice(
        {
          asset,
          apiKey:
            config.birdeye.apiKey,
          address:
            config.birdeye.address,
          chain:
            config.birdeye.chain,
          baseUrl:
            config.birdeye.baseUrl,
        },
        {
          timeoutMs:
            options.timeoutMs,
        },
      ) as Promise<PriceObservation>,
    });
  }

  if (
    providers.includes(
      "coinmarketcap",
    ) &&
    config.coinmarketcap?.apiKey
  ) {
    requests.push({
      provider:
        "coinmarketcap",
      promise:
        coinMarketCapPrice(
          {
            asset,
            symbol:
              config.coinmarketcap
                ?.symbol,
            apiKey:
              config.coinmarketcap
                ?.apiKey,
            baseUrl:
              config.coinmarketcap
                ?.baseUrl,
          },
          {
            timeoutMs:
              options.timeoutMs,
          },
        ),
    });
  }

  const settled =
    await Promise.allSettled(
      requests.map(
        request =>
          request.promise,
      ),
    );

  const failures:
    PriceProviderFailure[] = [];
  const sources:
    PriceObservation[] = [];

  settled.forEach(
    (result, index) => {
      const provider =
        requests[index]!.provider;

      if (
        result.status ===
        "fulfilled"
      ) {
        sources.push(
          result.value,
        );
      } else {
        failures.push({
          provider,
          message:
            result.reason instanceof
            Error
              ? result.reason.message
              : String(
                  result.reason,
                ),
        });
      }
    },
  );

  const now = Date.now();
  const fresh =
    sources.filter(
      source =>
        now -
          sourceTime(
            source,
          ) <=
        maxAgeMs,
    );

  const usable =
    fresh.length
      ? fresh
      : sources;

  if (!usable.length) {
    return {
      asset,
      quoteCurrency: "USD",
      available: false,
      priceUsd: null,
      priceUsdMicros: null,
      observedAt:
        new Date().toISOString(),
      sourceCount: 0,
      sources,
      failures,
      maxDivergenceBps: null,
      stale: true,
    };
  }

  const divergence =
    divergenceBps(usable);

  if (
    usable.length >= 2 &&
    divergence >
      maxDivergence
  ) {
    return {
      asset,
      quoteCurrency: "USD",
      available: false,
      priceUsd: null,
      priceUsdMicros: null,
      observedAt:
        new Date().toISOString(),
      sourceCount:
        usable.length,
      sources,
      failures: [
        ...failures,
        {
          provider:
            usable[0]!.provider,
          message:
            `price_divergence_${divergence}_bps`,
        },
      ],
      maxDivergenceBps:
        divergence,
      stale:
        fresh.length === 0,
    };
  }

  const priceUsd =
    median(
      usable.map(
        source =>
          source.priceUsd,
      ),
    );

  return {
    asset,
    quoteCurrency: "USD",
    available: true,
    priceUsd,
    priceUsdMicros:
      priceUsdToMicros(
        priceUsd,
      ).toString(),
    observedAt:
      new Date().toISOString(),
    sourceCount:
      usable.length,
    sources,
    failures,
    maxDivergenceBps:
      divergence,
    stale:
      fresh.length === 0,
  };
}
