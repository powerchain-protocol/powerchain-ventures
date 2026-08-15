import {
  BIRDEYE_API_BASE,
  COINMARKETCAP_API_BASE,
  HELIUS_API_BASE,
  HELIUS_MAINNET_RPC_BASE,
  PYTH_HERMES_BASE,
} from "@powerchain/integrations";

export function integrationConfig() {
  return {
    heliusApiKey:
      process.env.HELIUS_API_KEY?.trim() ??
      "",
    heliusRpcBase:
      process.env.HELIUS_RPC_URL?.trim() ||
      HELIUS_MAINNET_RPC_BASE,
    heliusApiBase:
      process.env.HELIUS_API_URL?.trim() ||
      HELIUS_API_BASE,

    pythApiKey:
      process.env.PYTH_API_KEY?.trim() ??
      "",
    pythHermesBaseUrl:
      process.env.PYTH_HERMES_URL?.trim() ||
      PYTH_HERMES_BASE,
    pythSolUsdFeedId:
      process.env.PYTH_SOL_USD_FEED_ID?.trim() ??
      "",
    pythUsdcUsdFeedId:
      process.env.PYTH_USDC_USD_FEED_ID?.trim() ??
      "",
    pythSuiUsdFeedId:
      process.env.PYTH_SUI_USD_FEED_ID?.trim() ??
      "",

    birdeyeApiKey:
      process.env.BIRDEYE_API_KEY?.trim() ??
      "",
    birdeyeBaseUrl:
      process.env.BIRDEYE_BASE_URL?.trim() ||
      BIRDEYE_API_BASE,

    coinMarketCapApiKey:
      process.env.COINMARKETCAP_API_KEY?.trim() ??
      "",
    coinMarketCapBaseUrl:
      process.env.COINMARKETCAP_BASE_URL?.trim() ||
      COINMARKETCAP_API_BASE,

    maxPriceAgeMs:
      Number(
        process.env.PRICE_MAX_AGE_MS ??
          90_000,
      ),
    maxPriceDivergenceBps:
      Number(
        process.env.PRICE_MAX_DIVERGENCE_BPS ??
          300,
      ),
  };
}

export function integrationStatus() {
  const config =
    integrationConfig();

  return {
    heliusConfigured:
      Boolean(
        config.heliusApiKey,
      ),
    pythConfigured:
      Boolean(
        config.pythSolUsdFeedId &&
        config.pythApiKey,
      ),
    pythAuthenticated:
      Boolean(
        config.pythApiKey,
      ),
    birdeyeConfigured:
      Boolean(
        config.birdeyeApiKey,
      ),
    coinMarketCapConfigured:
      Boolean(
        config.coinMarketCapApiKey,
      ),
    coinMarketCapAuthenticated:
      Boolean(
        config.coinMarketCapApiKey,
      ),

    heliusRpcBase:
      new URL(
        config.heliusRpcBase,
      ).origin,
    heliusApiBase:
      new URL(
        config.heliusApiBase,
      ).origin,
    pythHermesBaseUrl:
      new URL(
        config.pythHermesBaseUrl,
      ).origin,
    birdeyeBaseUrl:
      new URL(
        config.birdeyeBaseUrl,
      ).origin,
    coinMarketCapBaseUrl:
      new URL(
        config.coinMarketCapBaseUrl,
      ).origin,

    maxPriceAgeMs:
      config.maxPriceAgeMs,
    maxPriceDivergenceBps:
      config.maxPriceDivergenceBps,
  };
}
