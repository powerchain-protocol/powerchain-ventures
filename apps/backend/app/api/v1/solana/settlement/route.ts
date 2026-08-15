import {
  NextResponse,
} from "next/server";
import {
  settlementStateFromSignatureStatus,
} from "@powerchain/solana/settlement";
import {
  enforceRateLimit,
} from "../../../../../lib/rate-limit-response";
import {
  solanaRpc,
} from "../../../../../lib/solana-rpc";

export const runtime =
  "nodejs";
export const dynamic =
  "force-dynamic";

const SIGNATURE =
  /^[1-9A-HJ-NP-Za-km-z]{64,100}$/;

export async function GET(
  request: Request,
) {
  const limited =
    await enforceRateLimit(
      request,
      "solana.settlement",
      120,
    );

  if (limited) {
    return limited;
  }

  const signature =
    new URL(
      request.url,
    ).searchParams.get(
      "signature",
    )?.trim() ?? "";

  if (
    !SIGNATURE.test(
      signature,
    )
  ) {
    return NextResponse.json(
      {
        error: {
          code:
            "BAD_REQUEST",
          message:
            "Valid Solana transaction signature required",
        },
      },
      {
        status: 400,
      },
    );
  }

  try {
    const response =
      await solanaRpc<{
        value: Array<{
          slot: number;
          confirmations:
            number | null;
          err: unknown;
          confirmationStatus?:
            | "processed"
            | "confirmed"
            | "finalized"
            | null;
        } | null>;
      }>(
        "getSignatureStatuses",
        [
          [
            signature,
          ],
          {
            searchTransactionHistory:
              true,
          },
        ],
      );

    const status =
      response.result
        .value[0] ??
      null;

    return NextResponse.json(
      {
        signature,
        state:
          settlementStateFromSignatureStatus(
            status,
          ),
        slot:
          status?.slot ??
          null,
        confirmationStatus:
          status
            ?.confirmationStatus ??
          null,
        failed:
          Boolean(
            status?.err,
          ),
        endpoint:
          response.endpoint,
        latencyMs:
          response.latencyMs,
        observedAt:
          new Date()
            .toISOString(),
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
            "RPC_UNAVAILABLE",
          message:
            error instanceof Error
              ? error.message
              : "Solana settlement lookup failed",
        },
      },
      {
        status: 503,
      },
    );
  }
}
