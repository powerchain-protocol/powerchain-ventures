import {
  NextResponse,
} from "next/server";
import {
  isSolanaAddress,
} from "../../../../../../lib/policy";
import {
  enforceRateLimit,
} from "../../../../../../lib/rate-limit-response";
import {
  loadSolanaPayPurchaseReview,
} from "../../../../../../lib/payments/solana-pay";

export const runtime =
  "nodejs";
export const dynamic =
  "force-dynamic";


const SOLANA_PAY_CORS =
  Object.freeze({
    "access-control-allow-origin":
      "*",
    "access-control-allow-methods":
      "GET, POST, OPTIONS",
    "access-control-allow-headers":
      "Content-Type",
    "access-control-max-age":
      "600",
  } as const);

function responseHeaders() {
  return {
    ...SOLANA_PAY_CORS,
    "cache-control":
      "no-store",
    "x-powerchain-release":
      "1.0.0",
  };
}

function withCors(
  response: Response,
) {
  for (
    const [
      key,
      value,
    ]
    of Object.entries(
      SOLANA_PAY_CORS,
    )
  ) {
    response.headers.set(
      key,
      value,
    );
  }

  return response;
}

export async function OPTIONS() {
  return new Response(
    null,
    {
      status: 204,
      headers:
        SOLANA_PAY_CORS,
    },
  );
}

function reviewId(
  request: Request,
) {
  return new URL(
    request.url,
  ).searchParams.get(
    "reviewId",
  )?.trim() ?? "";
}

export async function GET(
  request: Request,
) {
  const limited =
    await enforceRateLimit(
      request,
      "solana-pay.transaction.get",
      60,
    );

  if (limited) {
    return withCors(
      limited,
    );
  }

  const id =
    reviewId(
      request,
    );

  if (!id) {
    return NextResponse.json(
      {
        error:
          "reviewId is required",
      },
      {
        status: 400,
        headers:
          responseHeaders(),
      },
    );
  }

  try {
    await loadSolanaPayPurchaseReview(
      id,
    );

    const appUrl =
      process.env
        .NEXT_PUBLIC_APP_URL ??
      "https://launchpad.powerchain.energy";

    return NextResponse.json(
      {
        label:
          "PowerChain Launchpad",
        icon:
          `${appUrl.replace(
            /\/$/,
            "",
          )}/icon.png`,
      },
      {
        headers:
          responseHeaders(),
      },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Payment request unavailable",
      },
      {
        status: 404,
        headers:
          responseHeaders(),
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  const limited =
    await enforceRateLimit(
      request,
      "solana-pay.transaction.post",
      30,
    );

  if (limited) {
    return withCors(
      limited,
    );
  }

  const id =
    reviewId(
      request,
    );

  let body:
    {
      account?: unknown;
    };

  try {
    body =
      await request.json() as
        {
          account?: unknown;
        };
  } catch {
    return NextResponse.json(
      {
        error:
          "JSON body required",
      },
      {
        status: 400,
        headers:
          responseHeaders(),
      },
    );
  }

  if (
    !id ||
    !isSolanaAddress(
      body.account,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Valid reviewId and account are required",
      },
      {
        status: 400,
        headers:
          responseHeaders(),
      },
    );
  }

  try {
    const review =
      await loadSolanaPayPurchaseReview(
        id,
      );

    if (
      review.status !==
      "prepared"
    ) {
      return NextResponse.json(
        {
          error:
            "Prepared purchase is no longer signable",
        },
        {
          status: 409,
          headers:
            responseHeaders(),
        },
      );
    }

    if (
      review.wallet !==
      body.account
    ) {
      return NextResponse.json(
        {
          error:
            "Wallet does not match the prepared purchase",
        },
        {
          status: 409,
          headers:
            responseHeaders(),
        },
      );
    }

    return NextResponse.json(
      {
        transaction:
          review.plan
            .serializedTransactionBase64,
        message:
          "Review and sign this PowerChain SOL → PWRC purchase.",
      },
      {
        headers:
          responseHeaders(),
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Payment request unavailable",
      },
      {
        status: 409,
        headers:
          responseHeaders(),
      },
    );
  }
}
