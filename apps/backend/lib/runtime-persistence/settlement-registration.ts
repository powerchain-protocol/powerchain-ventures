import type {
  OutboxEvent,
  SettlementRecord,
  SettlementRegistrationPersistence,
  SettlementState,
} from "@powerchain/token-data";

type TxLike = {
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: unknown[]
  ): Promise<T>;
  $executeRawUnsafe(
    query: string,
    ...values: unknown[]
  ): Promise<number>;
};

type PrismaTransactionalLike =
  TxLike & {
    $transaction<T>(
      input:
        (tx: TxLike) =>
          Promise<T>,
    ): Promise<T>;
  };

function mapSettlement(row: {
  settlement_id: string;
  mutation_id: string;
  kind:
    SettlementRecord["kind"];
  state:
    SettlementState;
  transaction_signature:
    string | null;
  submitted_at:
    Date | null;
  observed_at:
    Date | null;
  finalized_at:
    Date | null;
  reconciled_at:
    Date | null;
  error_code:
    string | null;
  created_at: Date;
  updated_at: Date;
}): SettlementRecord {
  return {
    settlementId:
      row.settlement_id,
    mutationId:
      row.mutation_id,
    kind:
      row.kind,
    state:
      row.state,
    transactionSignature:
      row.transaction_signature ??
      undefined,
    submittedAt:
      row.submitted_at
        ?.toISOString(),
    observedAt:
      row.observed_at
        ?.toISOString(),
    finalizedAt:
      row.finalized_at
        ?.toISOString(),
    reconciledAt:
      row.reconciled_at
        ?.toISOString(),
    errorCode:
      row.error_code ??
      undefined,
    createdAt:
      row.created_at
        .toISOString(),
    updatedAt:
      row.updated_at
        .toISOString(),
  };
}

const SELECT_SETTLEMENT = `
  SELECT
    settlement_id,
    mutation_id,
    kind,
    state,
    transaction_signature,
    submitted_at,
    observed_at,
    finalized_at,
    reconciled_at,
    error_code,
    created_at,
    updated_at
  FROM powerchain_runtime_settlements
`;

export function createPrismaSettlementRegistrationPersistence(
  prisma:
    PrismaTransactionalLike,
): SettlementRegistrationPersistence {
  return {
    async registerSubmitted(
      input,
    ) {
      return prisma.$transaction(
        async tx => {
          await tx
            .$executeRawUnsafe(
              `
              INSERT INTO powerchain_runtime_settlements
                (
                  settlement_id,
                  mutation_id,
                  kind,
                  state,
                  transaction_signature,
                  submitted_at,
                  created_at,
                  updated_at
                )
              VALUES (
                $1,$2,$3,'created',
                NULL,NULL,$4,$4
              )
              ON CONFLICT
              DO NOTHING
              `,
              input.settlement
                .settlementId,
              input.settlement
                .mutationId,
              input.settlement.kind,
              new Date(
                input.settlement
                  .createdAt,
              ),
            );

          const locked =
            await tx
              .$queryRawUnsafe<
                Array<{
                  settlement_id:
                    string;
                  mutation_id:
                    string;
                  kind:
                    SettlementRecord["kind"];
                  state:
                    SettlementState;
                  transaction_signature:
                    string | null;
                  submitted_at:
                    Date | null;
                  observed_at:
                    Date | null;
                  finalized_at:
                    Date | null;
                  reconciled_at:
                    Date | null;
                  error_code:
                    string | null;
                  created_at:
                    Date;
                  updated_at:
                    Date;
                }>
              >(
                `
                ${SELECT_SETTLEMENT}
                WHERE mutation_id = $1
                FOR UPDATE
                `,
                input.settlement
                  .mutationId,
              );

          const existing =
            locked[0];

          if (!existing) {
            throw new Error(
              "Settlement registration did not create or lock a settlement",
            );
          }

          if (
            existing
              .transaction_signature &&
            existing
              .transaction_signature !==
              input.signature
          ) {
            throw new Error(
              "Settlement is already bound to a different transaction signature",
            );
          }

          if (
            existing.state ===
            "failed"
          ) {
            throw new Error(
              "Failed settlement cannot be resubmitted automatically",
            );
          }

          if (
            existing.state ===
              "created" ||
            existing.state ===
              "manual-review"
          ) {
            await tx
              .$executeRawUnsafe(
                `
                UPDATE powerchain_runtime_settlements
                SET
                  state='submitted',
                  transaction_signature=$2,
                  submitted_at=COALESCE(
                    submitted_at,
                    $3
                  ),
                  error_code=NULL,
                  updated_at=$3
                WHERE
                  settlement_id=$1
                  AND state IN (
                    'created',
                    'manual-review'
                  )
                `,
                existing
                  .settlement_id,
                input.signature,
                new Date(),
              );
          } else if (
            !existing
              .transaction_signature
          ) {
            await tx
              .$executeRawUnsafe(
                `
                UPDATE powerchain_runtime_settlements
                SET
                  transaction_signature=$2,
                  updated_at=$3
                WHERE
                  settlement_id=$1
                  AND transaction_signature
                    IS NULL
                `,
                existing
                  .settlement_id,
                input.signature,
                new Date(),
              );
          }

          await tx
            .$executeRawUnsafe(
              `
              INSERT INTO powerchain_runtime_outbox
                (
                  event_id,
                  type,
                  aggregate_id,
                  payload,
                  state,
                  attempts,
                  available_at,
                  created_at,
                  updated_at
                )
              VALUES (
                $1,$2,$3,$4::jsonb,
                'pending',$5,$6,$7,$7
              )
              ON CONFLICT (event_id)
              DO UPDATE SET
                state='pending',
                owner_id=NULL,
                lease_until=NULL,
                completed_at=NULL,
                failed_at=NULL,
                last_error=NULL,
                last_error_at=NULL,
                available_at=EXCLUDED.available_at,
                updated_at=EXCLUDED.updated_at
              WHERE
                powerchain_runtime_outbox.state='failed'
              `,
              input.event.eventId,
              input.event.type,
              existing
                .settlement_id,
              JSON.stringify(
                input.event
                  .payload,
              ),
              input.event.attempts,
              new Date(
                input.event
                  .availableAt,
              ),
              new Date(
                input.event
                  .createdAt,
              ),
            );

          const finalRows =
            await tx
              .$queryRawUnsafe<
                Array<{
                  settlement_id:
                    string;
                  mutation_id:
                    string;
                  kind:
                    SettlementRecord["kind"];
                  state:
                    SettlementState;
                  transaction_signature:
                    string | null;
                  submitted_at:
                    Date | null;
                  observed_at:
                    Date | null;
                  finalized_at:
                    Date | null;
                  reconciled_at:
                    Date | null;
                  error_code:
                    string | null;
                  created_at:
                    Date;
                  updated_at:
                    Date;
                }>
              >(
                `
                ${SELECT_SETTLEMENT}
                WHERE settlement_id=$1
                LIMIT 1
                `,
                existing
                  .settlement_id,
              );

          const finalRow =
            finalRows[0];

          if (!finalRow) {
            throw new Error(
              "Settlement disappeared during registration",
            );
          }

          return mapSettlement(
            finalRow,
          );
        },
      );
    },
  };
}
