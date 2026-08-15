import {
  NextResponse,
} from "next/server";
import {
  protocolStatus,
} from "@powerchain/integrations/protocols";
import {
  stripeProviderStatus,
} from "../../../../../lib/payments/stripe";

export const runtime =
  "nodejs";
export const dynamic =
  "force-dynamic";

function enabled(
  value:
    string | undefined,
  fallback = false,
) {
  if (
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return value === "1" ||
    value === "true";
}

export async function GET() {
  const stripe =
    stripeProviderStatus();

  return NextResponse.json(
    {
      defaultMethod:
        "sol-pwrc",
      methods: {
        solPwrc: {
          enabled: true,
          settlement:
            "purchase",
        },
        solanaPay: {
          enabled:
            enabled(
              process.env
                .POWERCHAIN_SOLANA_PAY_ENABLED,
              true,
            ),
          settlement:
            "purchase",
        },
        coinbaseOnramp: {
          enabled:
            enabled(
              process.env
                .POWERCHAIN_COINBASE_ONRAMP_ENABLED,
              false,
            ),
          settlement:
            "funding",
        },
        stripe: {
          enabled:
            stripe.enabled,
          configured:
            stripe.configured,
          settlement:
            "funding",
          ...(stripe.configured &&
          stripe.hostedUrl
            ? {
                hostedUrl:
                  stripe.hostedUrl,
              }
            : {}),
        },
        usdc: {
          enabled:
            enabled(
              process.env
                .POWERCHAIN_USDC_PURCHASE_ENABLED,
              false,
            ),
          settlement:
            "purchase",
        },
        cctp: {
          enabled:
            enabled(
              process.env
                .POWERCHAIN_CCTP_ENABLED,
              false,
            ),
          settlement:
            "funding",
        },
        sui: {
          enabled:
            enabled(
              process.env
                .POWERCHAIN_SUI_PURCHASE_ENABLED,
              false,
            ),
          settlement:
            "purchase",
        },
        zkCompression: {
          enabled:
            enabled(
              process.env
                .POWERCHAIN_ZK_COMPRESSION_ENABLED,
              false,
            ),
          settlement:
            "disabled",
        },
      },
      protocols:
        protocolStatus(),
    },
    {
      headers: {
        "cache-control":
          "no-store",
        "x-powerchain-release":
          "1.0.0",
      },
    },
  );
}
