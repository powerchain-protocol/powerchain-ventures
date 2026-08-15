import {
  canTransitionSettlement,
  type SettlementRecord,
  type SettlementState,
} from "@powerchain/token-data";
import {
  getRuntimePersistence,
} from "../runtime-persistence";
import {
  outboxEventId,
  settlementIdForMutation,
} from "./id";

export async function ensureSettlement(input: {
  mutationId: string;
  kind:
    SettlementRecord["kind"];
}): Promise<SettlementRecord> {
  const persistence =
    getRuntimePersistence();

  const existing =
    await persistence
      .settlements
      .findByMutationId(
        input.mutationId,
      );

  if (existing) {
    return existing;
  }

  const settlementId =
    await settlementIdForMutation(
      input.mutationId,
    );

  const now =
    new Date().toISOString();

  const record:
    SettlementRecord = {
    settlementId,
    mutationId:
      input.mutationId,
    kind: input.kind,
    state: "created",
    createdAt: now,
    updatedAt: now,
  };

  await persistence.settlements.create(
    record,
  );

  return (
    await persistence
      .settlements.read(
        settlementId,
      )
  ) ?? record;
}

export async function transitionSettlement(
  input: {
    settlementId: string;
    expectedState:
      SettlementState;
    nextState:
      SettlementState;
    transactionSignature?: string;
    errorCode?: string;
    observedAt?: string;
    finalizedAt?: string;
    reconciledAt?: string;
  },
): Promise<boolean> {
  if (
    !canTransitionSettlement(
      input.expectedState,
      input.nextState,
    )
  ) {
    throw new Error(
      `Invalid settlement transition ${input.expectedState} -> ${input.nextState}`,
    );
  }

  const persistence =
    getRuntimePersistence();

  return persistence
    .settlements.transition(
      {
        ...input,
        updatedAt:
          new Date()
            .toISOString(),
      },
    );
}

export async function enqueueSettlementObservation(
  settlementId: string,
  signature: string,
): Promise<void> {
  const persistence =
    getRuntimePersistence();

  const eventId =
    await outboxEventId(
      "settlement.observe",
      `${settlementId}:${signature}`,
    );

  const now =
    new Date().toISOString();

  await persistence.outbox.enqueue(
    {
      eventId,
      type:
        "settlement.observe",
      aggregateId:
        settlementId,
      payload: {
        signature,
      },
      attempts: 0,
      availableAt: now,
      createdAt: now,
    },
  );
}

export async function registerSubmittedSettlement(
  input: {
    mutationId: string;
    kind:
      SettlementRecord["kind"];
    signature: string;
  },
): Promise<SettlementRecord> {
  const persistence =
    getRuntimePersistence();

  let settlement =
    await ensureSettlement(
      {
        mutationId:
          input.mutationId,
        kind:
          input.kind,
      },
    );

  if (
    settlement
      .transactionSignature &&
    settlement
      .transactionSignature !==
      input.signature
  ) {
    throw new Error(
      "Settlement is already bound to a different transaction signature",
    );
  }

  if (
    settlement.state ===
      "created" ||
    settlement.state ===
      "manual-review"
  ) {
    await transitionSettlement(
      {
        settlementId:
          settlement.settlementId,
        expectedState:
          settlement.state,
        nextState:
          "submitted",
        transactionSignature:
          input.signature,
      },
    );

    settlement =
      (
        await persistence
          .settlements.read(
            settlement
              .settlementId,
          )
      ) ?? settlement;
  }

  if (
    settlement.state ===
      "failed"
  ) {
    throw new Error(
      "Failed settlement cannot be resubmitted automatically",
    );
  }

  await enqueueSettlementObservation(
    settlement.settlementId,
    input.signature,
  );

  return settlement;
}
