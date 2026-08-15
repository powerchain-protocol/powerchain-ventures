export type PriceAsset =
  | "SOL"
  | "USDC"
  | "SUI"
  | "PWRC";

export type PriceProvider =
  | "pyth"
  | "birdeye"
  | "coinmarketcap";

export type PriceObservation = {
  asset: PriceAsset;
  quoteCurrency: "USD";
  provider: PriceProvider;
  priceUsd: number;
  priceUsdMicros: string;
  observedAt: string;
  sourceTimestamp?: string | null;
  confidenceUsd?: number | null;
  liquidityUsd?: number | null;
};

export type PriceProviderFailure = {
  provider: PriceProvider;
  message: string;
};

export type AggregatedPrice = {
  asset: PriceAsset;
  quoteCurrency: "USD";
  available: boolean;
  priceUsd: number | null;
  priceUsdMicros: string | null;
  observedAt: string;
  sourceCount: number;
  sources: PriceObservation[];
  failures: PriceProviderFailure[];
  maxDivergenceBps: number | null;
  stale: boolean;
};

export type RateSnapshot = {
  base: PriceAsset;
  quote: PriceAsset | "USD";
  rate: number;
  observedAt: string;
  source: string;
};
