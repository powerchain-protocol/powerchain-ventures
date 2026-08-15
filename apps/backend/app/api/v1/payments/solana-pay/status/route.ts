import {
  NextResponse,
} from "next/server";
import {
  enforceRateLimit,
} from "../../../../../../lib/rate-limit-response";
import {
  findSolanaPayPurchaseSignature,
  loadSolanaPayPurchaseReview,
} from "../../../../../../lib/payments/solana-pay";

export const runtime =
  "nodejs";
export const dynamic =
  "force-dynamic";

export async function GET(
  request: Request,
) {
  const limited =
    await enforceRateLimit(
      request,
      "solana-pay.status",
      60,
    );

  if (limited) {
    return limited;
  }

  const reviewId =
    new URL(
      request.url,
    ).searchParams.get(
      "reviewId",
    )?.trim();

  if (!reviewId) {
    return NextResponse.json(
      {
        error:
          "reviewId is required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const review =
      await loadSolanaPayPurchaseReview(
        reviewId,
      );

    const found =
      await findSolanaPayPurchaseSignature(
        review,
      );

    return NextResponse.json(
      found
        ? {
            found: true,
            ...found,
          }
        : {
            found: false,
          },
      {
        headers: {
          "cache-control":
            "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to inspect Solana Pay request",
      },
      {
        status: 409,
      },
    );
  }
}
