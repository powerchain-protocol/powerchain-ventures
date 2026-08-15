import type {
  AtomicIdempotencyPersistence,
  IdempotencyReservation,
} from "@powerchain/token-data";

type PrismaLike = {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

function mapRow(row: {
  idempotency_key: string;
  fingerprint: string;
  state: IdempotencyReservation["state"];
  status_code: number | null;
  response_body: unknown | null;
  expires_at: Date;
}): IdempotencyReservation {
  return {
    key: row.idempotency_key,
    fingerprint: row.fingerprint,
    state: row.state,
    statusCode: row.status_code,
    body: row.response_body,
    expiresAt: new Date(row.expires_at),
  };
}

export function createPrismaAtomicIdempotencyPersistence(
  prisma: PrismaLike,
): AtomicIdempotencyPersistence {
  return {
    async reserve(input) {
      const rows = await prisma.$queryRawUnsafe<Array<{
        idempotency_key: string;
        fingerprint: string;
        state: IdempotencyReservation["state"];
        status_code: number | null;
        response_body: unknown | null;
        expires_at: Date;
        inserted: boolean;
      }>>(
        `
        WITH inserted AS (
          INSERT INTO powerchain_runtime_idempotency_reservations
            (idempotency_key, fingerprint, state, expires_at)
          VALUES ($1, $2, 'reserved', $3)
          ON CONFLICT (idempotency_key) DO NOTHING
          RETURNING idempotency_key, fingerprint, state, status_code,
                    response_body, expires_at, true AS inserted
        )
        SELECT * FROM inserted
        UNION ALL
        SELECT idempotency_key, fingerprint, state, status_code,
               response_body, expires_at, false AS inserted
        FROM powerchain_runtime_idempotency_reservations
        WHERE idempotency_key = $1
          AND NOT EXISTS (SELECT 1 FROM inserted)
        LIMIT 1
        `,
        input.key,
        input.fingerprint,
        input.expiresAt,
      );

      const row = rows[0];
      if (!row) throw new Error("Atomic idempotency reservation returned no row");
      if (row.inserted) return { kind: "reserved" };
      return { kind: "existing", value: mapRow(row) };
    },

    async complete(input) {
      const updated = await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_idempotency_reservations
        SET state = 'completed',
            status_code = $3,
            response_body = $4::jsonb,
            updated_at = NOW()
        WHERE idempotency_key = $1
          AND fingerprint = $2
          AND state = 'reserved'
        `,
        input.key,
        input.fingerprint,
        input.statusCode,
        JSON.stringify(input.body),
      );
      if (updated !== 1) throw new Error("Atomic idempotency completion failed");
    },

    async fail(input) {
      const updated = await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_idempotency_reservations
        SET state = 'failed',
            status_code = $3,
            response_body = $4::jsonb,
            updated_at = NOW()
        WHERE idempotency_key = $1
          AND fingerprint = $2
          AND state = 'reserved'
        `,
        input.key,
        input.fingerprint,
        input.statusCode,
        JSON.stringify(input.body),
      );
      if (updated !== 1) throw new Error("Atomic idempotency failure update failed");
    },

    async read(key) {
      const rows = await prisma.$queryRawUnsafe<Array<{
        idempotency_key: string;
        fingerprint: string;
        state: IdempotencyReservation["state"];
        status_code: number | null;
        response_body: unknown | null;
        expires_at: Date;
      }>>(
        `
        SELECT idempotency_key, fingerprint, state, status_code,
               response_body, expires_at
        FROM powerchain_runtime_idempotency_reservations
        WHERE idempotency_key = $1
          AND expires_at > NOW()
        LIMIT 1
        `,
        key,
      );
      return rows[0] ? mapRow(rows[0]) : null;
    },
  };
}
