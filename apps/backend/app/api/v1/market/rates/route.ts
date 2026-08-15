import {
  error,
  json,
} from "../../../../../lib/http";
import {
  enforceRateLimit,
} from "../../../../../lib/rate-limit-response";
import {
  getMarketRates,
} from "../../../../../lib/integrations/prices";

export async function GET(
  request: Request,
) {
  try {
    const limited =
      await enforceRateLimit(
        request,
        "market.rates",
        60,
      );
    if (limited) return limited;

    return json(
      await getMarketRates(),
    );
  } catch (cause) {
    return error(
      "PROVIDER_UNAVAILABLE",
      cause instanceof Error
        ? cause.message
        : "Unable to load market rates",
      503,
    );
  }
}
