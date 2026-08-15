import {
  error,
  json,
} from "../../../../../lib/http";
import {
  enforceRateLimit,
} from "../../../../../lib/rate-limit-response";
import {
  getMarketRates,
  getUsdPrice,
} from "../../../../../lib/integrations/prices";
import type {
  PriceAsset,
} from "@powerchain/integrations";

const ASSETS =
  new Set<PriceAsset>([
    "SOL",
    "USDC",
    "SUI",
    "PWRC",
  ]);

export async function GET(
  request: Request,
) {
  try {
    const limited =
      await enforceRateLimit(
        request,
        "market.prices",
        60,
      );
    if (limited) return limited;

    const url =
      new URL(request.url);
    const asset =
      url.searchParams
        .get("asset")
        ?.toUpperCase() as
        | PriceAsset
        | undefined;

    if (asset) {
      if (!ASSETS.has(asset)) {
        return error(
          "BAD_REQUEST",
          "Unsupported asset",
          400,
        );
      }

      return json({
        price:
          await getUsdPrice(
            asset,
          ),
      });
    }

    return json(
      await getMarketRates(),
    );
  } catch (cause) {
    return error(
      "PROVIDER_UNAVAILABLE",
      cause instanceof Error
        ? cause.message
        : "Unable to load market prices",
      503,
    );
  }
}
