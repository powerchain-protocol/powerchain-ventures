import {
  fetchAggregatedPrice,
  rateBetween,
  usdMicrosToLamports,
  type AggregatedPrice,
  type PriceAsset,
} from "@powerchain/integrations";
import {
  SOLANA_USDC_MINT,
  SOLANA_WRAPPED_NATIVE_MINT_ADDRESS,
} from "@powerchain/launchpad-config";
import {
  integrationConfig,
} from "./config";
import {
  configuredPwrcMint,
} from "../wallet-assets";

const SUI_BIRDEYE_ADDRESS =
  "0x2::sui::SUI";

const PRICE_CACHE_TTL_MS = 10_000;

const cache =
  new Map<
    PriceAsset,
    {
      expiresAt: number;
      promise:
        Promise<AggregatedPrice>;
    }
  >();

function pythFeed(
  asset: PriceAsset,
) {
  const config =
    integrationConfig();

  if (asset === "SOL") {
    return config.pythSolUsdFeedId;
  }
  if (asset === "USDC") {
    return config.pythUsdcUsdFeedId;
  }
  if (asset === "SUI") {
    return config.pythSuiUsdFeedId;
  }
  return "";
}

function birdeyeAddress(
  asset: PriceAsset,
) {
  if (asset === "SOL") {
    return SOLANA_WRAPPED_NATIVE_MINT_ADDRESS;
  }
  if (asset === "USDC") {
    return process.env
      .NEXT_PUBLIC_SOLANA_CLUSTER ===
      "devnet"
      ? SOLANA_USDC_MINT.devnet
      : SOLANA_USDC_MINT[
          "mainnet-beta"
        ];
  }
  if (asset === "SUI") {
    return SUI_BIRDEYE_ADDRESS;
  }
  return configuredPwrcMint();
}

async function fetchUsdPriceUncached(
  asset: PriceAsset,
): Promise<AggregatedPrice> {
  const config =
    integrationConfig();

  return fetchAggregatedPrice(
    asset,
    {
      pyth: {
        apiKey:
          config.pythApiKey ||
          undefined,
        baseUrl:
          config.pythHermesBaseUrl,
        feedId:
          pythFeed(asset) ||
          undefined,
      },
      birdeye: {
        apiKey:
          config.birdeyeApiKey ||
          undefined,
        baseUrl:
          config.birdeyeBaseUrl,
        address:
          birdeyeAddress(asset) ||
          undefined,
        chain:
          asset === "SUI"
            ? "sui"
            : "solana",
      },
      coinmarketcap: {
        apiKey:
          config.coinMarketCapApiKey ||
          undefined,
        baseUrl:
          config.coinMarketCapBaseUrl,
        symbol: asset,
      },
    },
    {
      maxAgeMs:
        config.maxPriceAgeMs,
      maxDivergenceBps:
        config.maxPriceDivergenceBps,
      timeoutMs: 7_500,
      providers:
        asset === "PWRC"
          ? [
              "birdeye",
            ]
          : [
              "pyth",
              "birdeye",
              "coinmarketcap",
            ],
    },
  );
}

export function getUsdPrice(
  asset: PriceAsset,
): Promise<AggregatedPrice> {
  const now = Date.now();
  const current =
    cache.get(asset);

  if (
    current &&
    current.expiresAt > now
  ) {
    return current.promise;
  }

  const promise =
    fetchUsdPriceUncached(
      asset,
    ).catch(error => {
      const active =
        cache.get(asset);
      if (
        active?.promise ===
        promise
      ) {
        cache.delete(asset);
      }
      throw error;
    });

  cache.set(asset, {
    expiresAt:
      now +
      PRICE_CACHE_TTL_MS,
    promise,
  });

  return promise;
}

export function clearPriceCache(
  asset?: PriceAsset,
) {
  if (asset) {
    cache.delete(asset);
  } else {
    cache.clear();
  }
}

export async function requireUsdPrice(
  asset: PriceAsset,
) {
  const price =
    await getUsdPrice(asset);

  if (
    !price.available ||
    !price.priceUsdMicros ||
    price.stale
  ) {
    throw new Error(
      `${asset.toLowerCase()}_usd_price_unavailable`,
    );
  }

  return price;
}

export async function solPaymentAmounts(
  principalUsdMicros:
    string | bigint,
  serviceFeeUsdMicros:
    string | bigint,
) {
  const sol =
    await requireUsdPrice("SOL");

  const principalLamports =
    usdMicrosToLamports(
      principalUsdMicros,
      sol.priceUsdMicros!,
    );

  // The on-chain and confirmation policy defines the service fee
  // as exactly 250 bps of the SOL principal, rounded up. The USD fee
  // remains useful for the sale ledger, but must not be converted
  // independently because two independent ceil operations can diverge.
  void serviceFeeUsdMicros;
  const serviceFeeLamports =
    (
      principalLamports *
        250n +
      9_999n
    ) /
    10_000n;

  return {
    sol,
    principalLamports,
    serviceFeeLamports,
    totalLamports:
      principalLamports +
      serviceFeeLamports,
  };
}

export async function getMarketRates() {
  const results =
    await Promise.allSettled([
      getUsdPrice("SOL"),
      getUsdPrice("USDC"),
      getUsdPrice("SUI"),
      getUsdPrice("PWRC"),
    ]);

  const values =
    results.map(
      result =>
        result.status ===
        "fulfilled"
          ? result.value
          : null,
    );

  const byAsset =
    Object.fromEntries(
      values
        .filter(
          (
            value,
          ): value is AggregatedPrice =>
            Boolean(value),
        )
        .map(
          value => [
            value.asset,
            value,
          ],
        ),
    ) as Partial<
      Record<
        PriceAsset,
        AggregatedPrice
      >
    >;

  const rates:
    Record<string, unknown> = {};

  if (
    byAsset.PWRC?.available &&
    byAsset.SOL?.available
  ) {
    rates.PWRC_SOL =
      rateBetween(
        byAsset.PWRC,
        byAsset.SOL,
      );
    rates.SOL_PWRC =
      rateBetween(
        byAsset.SOL,
        byAsset.PWRC,
      );
  }

  return {
    prices: byAsset,
    rates,
    observedAt:
      new Date().toISOString(),
  };
}
