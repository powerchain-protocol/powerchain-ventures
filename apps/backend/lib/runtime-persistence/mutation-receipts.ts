import type {
  MutationReceipt,
  MutationReceiptPersistence,
} from "@powerchain/token-data";

type PrismaLike = {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

export function createPrismaMutationReceiptPersistence(
  prisma: PrismaLike,
): MutationReceiptPersistence {
  return {
    async read(mutationId) {
      const rows = await prisma.$queryRawUnsafe<Array<{
        mutation_id: string;
        request_id: string;
        kind: string;
        state: MutationReceipt["state"];
        status_code: number;
        replayed: boolean;
        created_at: Date;
        updated_at: Date;
        result: unknown;
        error_code: string | null;
      }>>(
        `
        SELECT mutation_id, request_id, kind, state, status_code, replayed,
               created_at, updated_at, result, error_code
        FROM powerchain_runtime_mutation_receipts
        WHERE mutation_id = $1
        LIMIT 1
        `,
        mutationId,
      );
      const row = rows[0];
      if (!row) return null;
      return {
        mutationId: row.mutation_id,
        requestId: row.request_id,
        kind: row.kind,
        state: row.state,
        statusCode: row.status_code,
        replayed: row.replayed,
        createdAt: new Date(row.created_at).toISOString(),
        updatedAt: new Date(row.updated_at).toISOString(),
        result: row.result ?? undefined,
        errorCode: row.error_code ?? undefined,
      };
    },

    async create(receipt) {
      const inserted = await prisma.$executeRawUnsafe(
        `
        INSERT INTO powerchain_runtime_mutation_receipts
          (mutation_id, request_id, kind, state, status_code, replayed,
           created_at, updated_at, result, error_code)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
        ON CONFLICT (mutation_id) DO NOTHING
        `,
        receipt.mutationId,
        receipt.requestId,
        receipt.kind,
        receipt.state,
        receipt.statusCode,
        receipt.replayed,
        new Date(receipt.createdAt),
        new Date(receipt.updatedAt),
        JSON.stringify(receipt.result ?? null),
        receipt.errorCode ?? null,
      );
      return inserted > 0 ? "created" : "exists";
    },

    async update(mutationId, patch) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_mutation_receipts
        SET state = COALESCE($2, state),
            status_code = COALESCE($3, status_code),
            updated_at = COALESCE($4, updated_at),
            result = COALESCE($5::jsonb, result),
            error_code = COALESCE($6, error_code),
            replayed = COALESCE($7, replayed)
        WHERE mutation_id = $1
        `,
        mutationId,
        patch.state ?? null,
        patch.statusCode ?? null,
        patch.updatedAt ? new Date(patch.updatedAt) : null,
        patch.result === undefined ? null : JSON.stringify(patch.result),
        patch.errorCode ?? null,
        patch.replayed ?? null,
      );
    },
  };
}
