import {
  NextResponse,
} from "next/server";
import {
  fetchCctpV2Messages,
  type CctpEnvironment,
} from "@powerchain/integrations/cctp";
import {
  enforceRateLimit,
} from "../../../../../../lib/rate-limit-response";

export const runtime =
  "nodejs";
export const dynamic =
  "force-dynamic";

function enabled() {
  return process.env
    .POWERCHAIN_CCTP_ENABLED ===
    "1";
}

export async function GET(
  request: Request,
) {
  const limited =
    await enforceRateLimit(
      request,
      "cctp.messages",
      30,
    );

  if (limited) {
    return limited;
  }

  if (!enabled()) {
    return NextResponse.json(
      {
        enabled: false,
        error: {
          code:
            "CONFIGURATION_ERROR",
          message:
            "CCTP V2 integration is disabled",
        },
      },
      {
        status: 503,
      },
    );
  }

  const url =
    new URL(
      request.url,
    );
  const sourceDomain =
    Number(
      url.searchParams.get(
        "sourceDomain",
      ),
    );
  const transactionHash =
    url.searchParams.get(
      "transactionHash",
    )?.trim() ?? "";

  if (
    !Number.isInteger(
      sourceDomain,
    ) ||
    sourceDomain < 0 ||
    transactionHash.length <
      16 ||
    transactionHash.length >
      200
  ) {
    return NextResponse.json(
      {
        error: {
          code:
            "BAD_REQUEST",
          message:
            "Valid sourceDomain and transactionHash are required",
        },
      },
      {
        status: 400,
      },
    );
  }

  const environment =
    (
      process.env
        .CCTP_ENVIRONMENT ===
      "testnet"
        ? "testnet"
        : "mainnet"
    ) satisfies CctpEnvironment;

  try {
    const result =
      await fetchCctpV2Messages(
        {
          environment,
          sourceDomain,
          transactionHash,
          apiKey:
            process.env
              .CIRCLE_API_KEY
              ?.trim() ||
            undefined,
        },
      );

    return NextResponse.json(
      {
        enabled: true,
        environment,
        sourceDomain,
        transactionHash,
        messages:
          result.messages ??
          [],
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
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code:
            "PROVIDER_UNAVAILABLE",
          message:
            error instanceof Error
              ? error.message
              : "CCTP Iris request failed",
        },
      },
      {
        status: 502,
      },
    );
  }
}
