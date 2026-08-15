import {
  NextResponse,
} from "next/server";
import {
  isSettlementId,
} from "../../../../../../../lib/settlement/id";
import {
  reconciliationAuthorized,
  reconciliationSecret,
} from "../../../../../../../lib/reconciliation-auth";
import {
  bootstrapRuntimePersistence,
} from "../../../../../../../lib/runtime-persistence/bootstrap";
import {
  getRuntimePersistence,
} from "../../../../../../../lib/runtime-persistence";
import {
  registerSubmittedSettlement,
  transitionSettlement,
} from "../../../../../../../lib/settlement/service";

export const dynamic =
  "force-dynamic";
export const runtime =
  "nodejs";

type Context = {
  params: Promise<{
    settlementId: string;
  }>;
};

type ActionBody = {
  action?:
    | "retry-observation"
    | "fail";
  reason?: string;
};

function operatorReason(
  value:
    | string
    | undefined,
) {
  const reason =
    value?.trim();

  if (!reason) {
    return null;
  }

  return reason
    .slice(0, 240);
}

export async function POST(
  request: Request,
  context: Context,
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
            "Settlement operations are not configured",
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

  const {
    settlementId,
  } =
    await context.params;

  if (
    !isSettlementId(
      settlementId,
    )
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code:
            "BAD_REQUEST",
          message:
            "Invalid settlement id",
        },
      },
      {
        status: 400,
      },
    );
  }

  let body:
    ActionBody;

  try {
    body =
      await request.json() as
        ActionBody;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code:
            "BAD_REQUEST",
          message:
            "JSON body required",
        },
      },
      {
        status: 400,
      },
    );
  }

  const action =
    body.action;

  if (
    action !==
      "retry-observation" &&
    action !==
      "fail"
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code:
            "BAD_REQUEST",
          message:
            "Unsupported settlement action",
        },
      },
      {
        status: 400,
      },
    );
  }

  const reason =
    operatorReason(
      body.reason,
    );

  if (!reason) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code:
            "BAD_REQUEST",
          message:
            "Operator reason is required",
        },
      },
      {
        status: 400,
      },
    );
  }

  try {
    await bootstrapRuntimePersistence();

    const persistence =
      getRuntimePersistence();

    const settlement =
      await persistence
        .settlements.read(
          settlementId,
        );

    if (!settlement) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code:
              "NOT_FOUND",
            message:
              "Settlement not found",
          },
        },
        {
          status: 404,
        },
      );
    }

    if (
      settlement.state !==
      "manual-review"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code:
              "CONFLICT",
            message:
              "Only manual-review settlements accept operator actions",
          },
        },
        {
          status: 409,
        },
      );
    }

    if (
      action ===
      "retry-observation"
    ) {
      if (
        !settlement
          .transactionSignature
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code:
                "CONFLICT",
              message:
                "Settlement has no transaction signature to observe",
            },
          },
          {
            status: 409,
          },
        );
      }

      const updated =
        await registerSubmittedSettlement(
          {
            mutationId:
              settlement
                .mutationId,
            kind:
              settlement.kind,
            signature:
              settlement
                .transactionSignature,
          },
        );

      await persistence.audit.append(
        {
          event:
            "settlement_operator_retry",
          route:
            "/api/v1/runtime/settlements/[settlementId]/action",
          status: 200,
          code:
            "MANUAL_REVIEW_REQUEUED",
          metadata: {
            settlementId,
            reason,
            previousState:
              "manual-review",
            nextState:
              updated.state,
          },
          occurredAt:
            new Date(),
        },
      );

      return NextResponse.json(
        {
          ok: true,
          settlement:
            updated,
          action,
        },
        {
          headers: {
            "cache-control":
              "no-store",
          },
        },
      );
    }

    const changed =
      await transitionSettlement(
        {
          settlementId,
          expectedState:
            "manual-review",
          nextState:
            "failed",
          errorCode:
            "OPERATOR_FAILED",
        },
      );

    if (!changed) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code:
              "CONFLICT",
            message:
              "Settlement state changed before operator action",
          },
        },
        {
          status: 409,
        },
      );
    }

    await persistence.audit.append(
      {
        event:
          "settlement_operator_fail",
        route:
          "/api/v1/runtime/settlements/[settlementId]/action",
        status: 200,
        code:
          "MANUAL_REVIEW_FAILED",
        metadata: {
          settlementId,
          reason,
          previousState:
            "manual-review",
          nextState:
            "failed",
        },
        occurredAt:
          new Date(),
      },
    );

    return NextResponse.json(
      {
        ok: true,
        action,
        settlement:
          await persistence
            .settlements.read(
              settlementId,
            ),
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
        ok: false,
        error: {
          code:
            "SETTLEMENT_ACTION_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Settlement action failed",
        },
      },
      {
        status: 500,
      },
    );
  }
}
