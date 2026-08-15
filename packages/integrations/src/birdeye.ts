import {
  fetchIntegrationJson,
  type IntegrationRequestOptions,
} from "./http.js";
import {
  priceUsdToMicros,
} from "./amount.js";
import type {
  PriceAsset,
  PriceObservation,
} from "./types.js";

export const BIRDEYE_API_BASE =
  "https://public-api.birdeye.so" as const;

export function birdeyeHeaders(
  apiKey: string,
  chain: "solana" | "sui" = "solana",
) {
  if (!apiKey.trim()) {
    throw new Error("birdeye_api_key_required");
  }

  return {
    accept: "application/json",
    "X-API-KEY": apiKey.trim(),
    "x-chain": chain,
  };
}

export async function birdeyePriceRaw(input: {
  apiKey: string;
  address: string;
  chain?: "solana" | "sui";
  baseUrl?: string;
}, options: IntegrationRequestOptions = {}) {
  const url = new URL(
    "/defi/price",
    input.baseUrl ?? BIRDEYE_API_BASE,
  );
  url.searchParams.set("address", input.address);
  url.searchParams.set("include_liquidity", "true");

  return fetchIntegrationJson<{
    success?: boolean;
    data?: {
      value?: number;
      updateUnixTime?: number;
      liquidity?: number;
    } | null;
  }>(
    url.toString(),
    {
      headers: birdeyeHeaders(
        input.apiKey,
        input.chain,
      ),
    },
    options,
  );
}

export async function birdeyePrice(input: {
  asset?: PriceAsset;
  apiKey: string;
  mint?: string;
  address?: string;
  chain?: "solana" | "sui";
  baseUrl?: string;
}, options: IntegrationRequestOptions = {}) {
  const address =
    input.address ?? input.mint;

  if (!address) {
    throw new Error(
      "birdeye_address_required",
    );
  }

  const result =
    await birdeyePriceRaw(
      {
        apiKey: input.apiKey,
        address,
        chain: input.chain,
        baseUrl: input.baseUrl,
      },
      options,
    );

  if (!input.asset) {
    return result;
  }

  const value = result.data?.value;

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error(
      "birdeye_price_missing",
    );
  }

  return {
    asset: input.asset,
    quoteCurrency: "USD",
    provider: "birdeye",
    priceUsd: value,
    priceUsdMicros:
      priceUsdToMicros(value).toString(),
    observedAt: new Date().toISOString(),
    sourceTimestamp:
      typeof result.data?.updateUnixTime ===
      "number"
        ? new Date(
            result.data.updateUnixTime *
              1_000,
          ).toISOString()
        : null,
    confidenceUsd: null,
    liquidityUsd:
      typeof result.data?.liquidity ===
      "number"
        ? result.data.liquidity
        : null,
  } satisfies PriceObservation;
}

export async function birdeyeTokenOverview(input: {
  apiKey: string;
  mint: string;
  baseUrl?: string;
}, options: IntegrationRequestOptions = {}) {
  const url = new URL(
    "/defi/token_overview",
    input.baseUrl ?? BIRDEYE_API_BASE,
  );
  url.searchParams.set(
    "address",
    input.mint,
  );
  url.searchParams.set(
    "frames",
    "1h,24h",
  );
  url.searchParams.set(
    "ui_amount_mode",
    "raw",
  );

  return fetchIntegrationJson<{
    success?: boolean;
    data?: Record<string, unknown> | null;
  }>(
    url.toString(),
    {
      headers:
        birdeyeHeaders(
          input.apiKey,
          "solana",
        ),
    },
    options,
  );
}
