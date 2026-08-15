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

export const PYTH_HERMES_BASE =
  "https://pyth.dourolabs.app/hermes" as const;

type PythPricePayload = {
  parsed?: Array<{
    id?: string;
    price?: {
      price?: string;
      conf?: string;
      expo?: number;
      publish_time?: number;
    };
  }>;
};

function fixedValue(
  raw: string,
  expo: number,
  allowZero = false,
): number {
  const integer = Number(raw);
  const value =
    integer * 10 ** expo;

  if (
    !Number.isFinite(value) ||
    (allowZero
      ? value < 0
      : value <= 0)
  ) {
    throw new Error("pyth_invalid_price");
  }

  return value;
}

export async function pythPrice(input: {
  asset: PriceAsset;
  feedId: string;
  apiKey?: string;
  baseUrl?: string;
}, options: IntegrationRequestOptions = {}): Promise<PriceObservation> {
  const feedId = input.feedId.trim();
  if (!/^(0x)?[0-9a-fA-F]{64}$/.test(feedId)) {
    throw new Error("pyth_feed_id_required");
  }

  const url = new URL(
    "/v2/updates/price/latest",
    input.baseUrl ?? PYTH_HERMES_BASE,
  );
  url.searchParams.append(
    "ids[]",
    feedId.startsWith("0x")
      ? feedId
      : `0x${feedId}`,
  );
  url.searchParams.set("parsed", "true");

  const body =
    await fetchIntegrationJson<PythPricePayload>(
      url.toString(),
      {
        headers: {
          accept: "application/json",
          ...(input.apiKey?.trim()
            ? {
                authorization:
                  `Bearer ${input.apiKey.trim()}`,
              }
            : {}),
        },
      },
      options,
    );

  const row = body.parsed?.[0];
  const price = row?.price;

  if (
    !price?.price ||
    !Number.isInteger(price.expo)
  ) {
    throw new Error("pyth_price_missing");
  }

  const priceUsd =
    fixedValue(
      price.price,
      price.expo!,
    );

  const confidenceUsd =
    price.conf
      ? fixedValue(
          price.conf,
          price.expo!,
          true,
        )
      : null;

  const sourceTimestamp =
    typeof price.publish_time === "number"
      ? new Date(
          price.publish_time * 1_000,
        ).toISOString()
      : null;

  return {
    asset: input.asset,
    quoteCurrency: "USD",
    provider: "pyth",
    priceUsd,
    priceUsdMicros:
      priceUsdToMicros(priceUsd).toString(),
    observedAt: new Date().toISOString(),
    sourceTimestamp,
    confidenceUsd,
    liquidityUsd: null,
  };
}
