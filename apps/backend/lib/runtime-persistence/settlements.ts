import type {
  SettlementPersistence,
  SettlementRecord,
  SettlementState,
} from "@powerchain/token-data";

type PrismaLike = {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

function map(row: {
  settlement_id: string;
  mutation_id: string;
  kind: SettlementRecord["kind"];
  state: SettlementState;
  transaction_signature: string | null;
  submitted_at: Date | null;
  observed_at: Date | null;
  finalized_at: Date | null;
  reconciled_at: Date | null;
  error_code: string | null;
  created_at: Date;
  updated_at: Date;
}): SettlementRecord {
  return {
    settlementId: row.settlement_id,
    mutationId: row.mutation_id,
    kind: row.kind,
    state: row.state,
    transactionSignature: row.transaction_signature ?? undefined,
    submittedAt: row.submitted_at?.toISOString(),
    observedAt: row.observed_at?.toISOString(),
    finalizedAt: row.finalized_at?.toISOString(),
    reconciledAt: row.reconciled_at?.toISOString(),
    errorCode: row.error_code ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export function createPrismaSettlementPersistence(prisma: PrismaLike): SettlementPersistence {
  const select = `
    SELECT settlement_id, mutation_id, kind, state, transaction_signature,
           submitted_at, observed_at, finalized_at, reconciled_at,
           error_code, created_at, updated_at
    FROM powerchain_runtime_settlements
  `;

  return {
    async read(settlementId) {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `${select} WHERE settlement_id = $1 LIMIT 1`,
        settlementId,
      );
      return rows[0] ? map(rows[0]) : null;
    },

    async findByMutationId(mutationId) {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `${select} WHERE mutation_id = $1 LIMIT 1`,
        mutationId,
      );
      return rows[0] ? map(rows[0]) : null;
    },

    async create(record) {
      const inserted = await prisma.$executeRawUnsafe(
        `
        INSERT INTO powerchain_runtime_settlements
          (settlement_id, mutation_id, kind, state, transaction_signature,
           submitted_at, observed_at, finalized_at, reconciled_at,
           error_code, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT (settlement_id) DO NOTHING
        `,
        record.settlementId,
        record.mutationId,
        record.kind,
        record.state,
        record.transactionSignature ?? null,
        record.submittedAt ? new Date(record.submittedAt) : null,
        record.observedAt ? new Date(record.observedAt) : null,
        record.finalizedAt ? new Date(record.finalizedAt) : null,
        record.reconciledAt ? new Date(record.reconciledAt) : null,
        record.errorCode ?? null,
        new Date(record.createdAt),
        new Date(record.updatedAt),
      );
      return inserted > 0 ? "created" : "exists";
    },

    async transition(input) {
      const updated = await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_settlements
        SET state = $3,
            transaction_signature = COALESCE($4, transaction_signature),
            submitted_at = CASE
              WHEN $3 = 'submitted'
                THEN COALESCE(submitted_at, $9)
              ELSE submitted_at
            END,
            error_code = COALESCE($5, error_code),
            observed_at = COALESCE($6, observed_at),
            finalized_at = COALESCE($7, finalized_at),
            reconciled_at = COALESCE($8, reconciled_at),
            updated_at = $9
        WHERE settlement_id = $1
          AND state = $2
        `,
        input.settlementId,
        input.expectedState,
        input.nextState,
        input.transactionSignature ?? null,
        input.errorCode ?? null,
        input.observedAt ? new Date(input.observedAt) : null,
        input.finalizedAt ? new Date(input.finalizedAt) : null,
        input.reconciledAt ? new Date(input.reconciledAt) : null,
        new Date(input.updatedAt),
      );
      return updated === 1;
    },
  };
}
