import {
  NextResponse,
} from "next/server";
import {
  bootstrapRuntimePersistence,
} from "../../../../../../lib/runtime-persistence/bootstrap";
import {
  checkRuntimePersistenceHealth,
} from "../../../../../../lib/runtime-persistence/health";
import {
  reconciliationAuthorized,
  reconciliationSecret,
} from "../../../../../../lib/reconciliation-auth";
import {
  processSettlementOutboxBatch,
} from "../../../../../../lib/settlement/reconciliation-worker";
import {
  settlementSolanaRpc,
} from "../../../../../../lib/settlement/rpc-adapter";

export const dynamic =
  "force-dynamic";
export const runtime =
  "nodejs";

async function run(
  request: Request,
) {
  if (
    !reconciliationSecret()
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code:
            "CONFIGURATION_ERROR",
          message:
            "Reconciliation is not configured",
        },
      },
      {
        status: 503,
      },
    );
  }

  if (
    !reconciliationAuthorized(
      request,
    )
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code:
            "UNAUTHORIZED",
          message:
            "Unauthorized",
        },
      },
      {
        status: 401,
      },
    );
  }

  try {
    const bootstrap =
      await bootstrapRuntimePersistence();

    const ownerId =
      `settlement-worker:${crypto.randomUUID()}`;

    const batch =
      await processSettlementOutboxBatch(
        {
          rpc:
            settlementSolanaRpc,
          ownerId,
          limit:
            Number(
              process.env
                .SETTLEMENT_WORKER_BATCH_SIZE ??
                50,
            ),
        },
      );

    const health =
      await checkRuntimePersistenceHealth();

    return NextResponse.json(
      {
        ok:
          health.ready,
        bootstrap: {
          mode:
            bootstrap.mode,
          initialized:
            bootstrap.initialized,
        },
        batch,
        outbox:
          health.outbox,
        checkedAt:
          health.checkedAt,
      },
      {
        status:
          health.ready
            ? 200
            : 503,
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
        ok: false,
        error: {
          code:
            "SETTLEMENT_WORKER_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Settlement worker failed",
        },
      },
      {
        status: 500,
        headers: {
          "cache-control":
            "no-store",
        },
      },
    );
  }
}

export const GET = run;
export const POST = run;
