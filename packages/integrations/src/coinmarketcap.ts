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

export const COINMARKETCAP_API_BASE =
  "https://pro-api.coinmarketcap.com" as const;

type CmcQuote = {
  id?: number;
  symbol?: string;
  name?: string;
  last_updated?: string;
  quote?: Array<{
    symbol?: string;
    price?: number;
    last_updated?: string;
  }> | Record<
    string,
    {
      price?: number;
      last_updated?: string;
    }
  >;
};

function quoteUsd(
  quote: CmcQuote["quote"],
) {
  if (Array.isArray(quote)) {
    return quote.find(
      value =>
        value.symbol === "USD",
    );
  }
  return quote?.USD;
}

export async function coinMarketCapPrice(input: {
  asset: PriceAsset;
  symbol?: string;
  apiKey?: string;
  baseUrl?: string;
}, options: IntegrationRequestOptions = {}): Promise<PriceObservation> {
  const apiKey =
    input.apiKey?.trim();

  if (!apiKey) {
    throw new Error(
      "coinmarketcap_api_key_required",
    );
  }

  const url = new URL(
    "/v3/cryptocurrency/quotes/latest",
    input.baseUrl ??
      COINMARKETCAP_API_BASE,
  );

  url.searchParams.set(
    "symbol",
    input.symbol ?? input.asset,
  );
  url.searchParams.set(
    "convert",
    "USD",
  );
  url.searchParams.set(
    "skip_invalid",
    "true",
  );

  const body =
    await fetchIntegrationJson<{
      data?: CmcQuote[] | Record<string, CmcQuote | CmcQuote[]>;
    }>(
      url.toString(),
      {
        headers: {
          accept: "application/json",
          "X-CMC_PRO_API_KEY":
            apiKey,
        },
      },
      options,
    );

  let row: CmcQuote | undefined;

  if (Array.isArray(body.data)) {
    row =
      body.data.find(
        item =>
          item.symbol ===
          (input.symbol ??
            input.asset),
      ) ?? body.data[0];
  } else if (body.data) {
    const candidate =
      body.data[
        input.symbol ??
          input.asset
      ];

    row =
      Array.isArray(candidate)
        ? candidate[0]
        : candidate;

    if (!row) {
      const first =
        Object.values(body.data)[0];
      row =
        Array.isArray(first)
          ? first[0]
          : first;
    }
  }

  const usd = quoteUsd(
    row?.quote,
  );
  const priceUsd =
    usd?.price;

  if (
    typeof priceUsd !== "number" ||
    !Number.isFinite(priceUsd) ||
    priceUsd <= 0
  ) {
    throw new Error(
      "coinmarketcap_price_missing",
    );
  }

  return {
    asset: input.asset,
    quoteCurrency: "USD",
    provider: "coinmarketcap",
    priceUsd,
    priceUsdMicros:
      priceUsdToMicros(priceUsd).toString(),
    observedAt: new Date().toISOString(),
    sourceTimestamp:
      usd?.last_updated ??
      row?.last_updated ??
      null,
    confidenceUsd: null,
    liquidityUsd: null,
  };
}
