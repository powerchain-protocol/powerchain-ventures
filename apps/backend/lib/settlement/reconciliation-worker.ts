import {
  POWERCHAIN_RECONCILIATION_POLICY,
  decideReconciliation,
  settlementStateFromObservation,
} from "@powerchain/token-data";
import {
  getRuntimePersistence,
} from "../runtime-persistence";
import {
  observeSolanaTransaction,
  type SolanaRpcLike,
} from "./solana-observer";

export type SettlementBatchResult = {
  processed: number;
  retried: number;
  failed: number;
  recoveredLeases: number;
};

function retryError(
  error: unknown,
) {
  return (
    error instanceof Error
      ? error.message
      : "settlement_worker_error"
  ).slice(0, 240);
}

export async function processSettlementOutboxBatch(
  input: {
    rpc: SolanaRpcLike;
    ownerId: string;
    limit?: number;
  },
): Promise<SettlementBatchResult> {
  const persistence =
    getRuntimePersistence();

  const recoveredLeases =
    await persistence.outbox
      .recoverExpiredLeases(
        input.limit ?? 20,
        new Date(),
      );

  const events =
    await persistence.outbox.claim(
      input.limit ?? 20,
      input.ownerId,
      new Date(
        Date.now() +
          30_000,
      ),
    );

  let processed = 0;
  let retried = 0;
  let failed = 0;

  for (
    const event
    of events
  ) {
    try {
      if (
        event.type !==
        "settlement.observe"
      ) {
        await persistence.outbox.complete(
          event.eventId,
          input.ownerId,
        );
        processed += 1;
        continue;
      }

      const settlement =
        await persistence.settlements.read(
          event.aggregateId,
        );

      if (
        !settlement
          ?.transactionSignature
      ) {
        await persistence.outbox.fail(
          event.eventId,
          input.ownerId,
          "SETTLEMENT_SIGNATURE_MISSING",
        );
        failed += 1;
        continue;
      }

      if (
        settlement.state ===
          "reconciled" ||
        settlement.state ===
          "failed"
      ) {
        await persistence.outbox.complete(
          event.eventId,
          input.ownerId,
        );
        processed += 1;
        continue;
      }

      const observation =
        await observeSolanaTransaction(
          input.rpc,
          settlement
            .transactionSignature,
        );

      const targetState =
        settlementStateFromObservation(
          observation.state,
        );

      if (
        targetState !==
          settlement.state &&
        targetState !==
          "submitted"
      ) {
        const transitionable =
          (
            settlement.state ===
              "submitted" &&
            [
              "observed",
              "confirmed",
              "finalized",
              "failed",
            ].includes(
              targetState,
            )
          ) ||
          (
            settlement.state ===
              "observed" &&
            [
              "confirmed",
              "finalized",
              "failed",
            ].includes(
              targetState,
            )
          ) ||
          (
            settlement.state ===
              "confirmed" &&
            [
              "finalized",
              "failed",
            ].includes(
              targetState,
            )
          );

        if (transitionable) {
          await persistence.settlements.transition(
            {
              settlementId:
                settlement
                  .settlementId,
              expectedState:
                settlement.state,
              nextState:
                targetState,
              observedAt:
                observation
                  .observedAt,
              finalizedAt:
                targetState ===
                "finalized"
                  ? observation
                      .observedAt
                  : undefined,
              errorCode:
                targetState ===
                "failed"
                  ? "CHAIN_TRANSACTION_FAILED"
                  : undefined,
              updatedAt:
                observation
                  .observedAt,
            },
          );
        }
      }

      const latest =
        (
          await persistence
            .settlements.read(
              settlement
                .settlementId,
            )
        ) ?? settlement;

      const ageMs =
        Date.now() -
        Date.parse(
          latest.createdAt,
        );

      const decision =
        decideReconciliation(
          {
            settlementState:
              latest.state,
            observationState:
              observation.state,
            attempts:
              event.attempts,
            maxAttempts:
              POWERCHAIN_RECONCILIATION_POLICY
                .maxAttempts,
            ageMs,
            maxAgeMs:
              POWERCHAIN_RECONCILIATION_POLICY
                .maxAgeMs,
          },
        );

      if (
        decision.decision ===
        "finalize"
      ) {
        const finalRecord =
          await persistence
            .settlements.read(
              latest.settlementId,
            );

        if (
          finalRecord?.state ===
          "finalized"
        ) {
          await persistence
            .settlements.transition(
              {
                settlementId:
                  finalRecord
                    .settlementId,
                expectedState:
                  "finalized",
                nextState:
                  "reconciled",
                reconciledAt:
                  new Date()
                    .toISOString(),
                updatedAt:
                  new Date()
                    .toISOString(),
              },
            );
        }

        await persistence.outbox.complete(
          event.eventId,
          input.ownerId,
        );
        processed += 1;
        continue;
      }

      if (
        decision.decision ===
        "fail"
      ) {
        await persistence.outbox.fail(
          event.eventId,
          input.ownerId,
          "CHAIN_TRANSACTION_FAILED",
        );
        failed += 1;
        continue;
      }

      if (
        decision.decision ===
        "manual-review"
      ) {
        const current =
          await persistence
            .settlements.read(
              latest.settlementId,
            );

        if (
          current &&
          current.state !==
            "manual-review" &&
          current.state !==
            "reconciled" &&
          current.state !==
            "failed"
        ) {
          await persistence
            .settlements.transition(
              {
                settlementId:
                  current
                    .settlementId,
                expectedState:
                  current.state,
                nextState:
                  "manual-review",
                errorCode:
                  "RECONCILIATION_BOUNDS_EXHAUSTED",
                updatedAt:
                  new Date()
                    .toISOString(),
              },
            )
            .catch(
              () => false,
            );
        }

        await persistence.outbox.fail(
          event.eventId,
          input.ownerId,
          "RECONCILIATION_BOUNDS_EXHAUSTED",
        );
        failed += 1;
        continue;
      }

      await persistence.outbox.retry(
        event.eventId,
        input.ownerId,
        new Date(
          Date.now() +
            POWERCHAIN_RECONCILIATION_POLICY
              .pollIntervalMs,
        ),
      );
      retried += 1;
    } catch (error) {
      await persistence.outbox
        .retry(
          event.eventId,
          input.ownerId,
          new Date(
            Date.now() +
              POWERCHAIN_RECONCILIATION_POLICY
                .pollIntervalMs,
          ),
          retryError(error),
        )
        .catch(() => {});
      retried += 1;
    }
  }

  return {
    processed,
    retried,
    failed,
    recoveredLeases,
  };
}
