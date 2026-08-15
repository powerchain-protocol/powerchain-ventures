import type {
  OutboxEvent,
  OutboxPersistence,
} from "@powerchain/token-data";

type PrismaLike = {
  $queryRawUnsafe<
    T = unknown,
  >(
    query: string,
    ...values: unknown[]
  ): Promise<T>;
  $executeRawUnsafe(
    query: string,
    ...values: unknown[]
  ): Promise<number>;
};

export function createPrismaOutboxPersistence(
  prisma: PrismaLike,
): OutboxPersistence {
  return {
    async enqueue(event) {
      const inserted =
        await prisma.$executeRawUnsafe(
          `
          INSERT INTO powerchain_runtime_outbox
            (event_id, type, aggregate_id, payload, attempts,
             available_at, created_at, updated_at, state)
          VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$7,'pending')
          ON CONFLICT (event_id) DO NOTHING
          `,
          event.eventId,
          event.type,
          event.aggregateId,
          JSON.stringify(
            event.payload,
          ),
          event.attempts,
          new Date(
            event.availableAt,
          ),
          new Date(
            event.createdAt,
          ),
        );

      return inserted > 0
        ? "created"
        : "exists";
    },

    async claim(
      limit,
      ownerId,
      leaseUntil,
    ) {
      const rows =
        await prisma.$queryRawUnsafe<
          Array<{
            event_id: string;
            type:
              OutboxEvent["type"];
            aggregate_id: string;
            payload: unknown;
            attempts: number;
            available_at: Date;
            created_at: Date;
          }>
        >(
          `
          WITH picked AS (
            SELECT event_id
            FROM powerchain_runtime_outbox
            WHERE state IN ('pending','processing')
              AND available_at <= NOW()
              AND (
                lease_until IS NULL
                OR lease_until <= NOW()
              )
            ORDER BY available_at ASC,
                     created_at ASC
            FOR UPDATE SKIP LOCKED
            LIMIT $1
          )
          UPDATE powerchain_runtime_outbox o
          SET state = 'processing',
              owner_id = $2,
              lease_until = $3,
              attempts = attempts + 1,
              updated_at = NOW()
          FROM picked
          WHERE o.event_id = picked.event_id
          RETURNING o.event_id,
                    o.type,
                    o.aggregate_id,
                    o.payload,
                    o.attempts,
                    o.available_at,
                    o.created_at
          `,
          limit,
          ownerId,
          leaseUntil,
        );

      return rows.map(
        row => ({
          eventId:
            row.event_id,
          type: row.type,
          aggregateId:
            row.aggregate_id,
          payload:
            row.payload,
          attempts:
            row.attempts,
          availableAt:
            row.available_at.toISOString(),
          createdAt:
            row.created_at.toISOString(),
        }),
      );
    },

    async complete(
      eventId,
      ownerId,
    ) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_outbox
        SET state='completed',
            owner_id=NULL,
            lease_until=NULL,
            completed_at=NOW(),
            updated_at=NOW()
        WHERE event_id=$1
          AND owner_id=$2
        `,
        eventId,
        ownerId,
      );
    },

    async retry(
      eventId,
      ownerId,
      availableAt,
      errorCode,
    ) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_outbox
        SET state='pending',
            owner_id=NULL,
            lease_until=NULL,
            available_at=$3,
            last_error=COALESCE($4,last_error),
            last_error_at=CASE
              WHEN $4 IS NULL
                THEN last_error_at
              ELSE NOW()
            END,
            updated_at=NOW()
        WHERE event_id=$1
          AND owner_id=$2
        `,
        eventId,
        ownerId,
        availableAt,
        errorCode ?? null,
      );
    },

    async fail(
      eventId,
      ownerId,
      errorCode,
    ) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_outbox
        SET state='failed',
            owner_id=NULL,
            lease_until=NULL,
            completed_at=NOW(),
            failed_at=NOW(),
            last_error=COALESCE($3,last_error),
            last_error_at=CASE
              WHEN $3 IS NULL
                THEN last_error_at
              ELSE NOW()
            END,
            updated_at=NOW()
        WHERE event_id=$1
          AND owner_id=$2
        `,
        eventId,
        ownerId,
        errorCode ?? null,
      );
    },

    async recoverExpiredLeases(
      limit,
      now,
    ) {
      const updated =
        await prisma.$executeRawUnsafe(
          `
          WITH stale AS (
            SELECT event_id
            FROM powerchain_runtime_outbox
            WHERE state='processing'
              AND lease_until IS NOT NULL
              AND lease_until <= $1
            ORDER BY lease_until ASC
            FOR UPDATE SKIP LOCKED
            LIMIT $2
          )
          UPDATE powerchain_runtime_outbox o
          SET state='pending',
              owner_id=NULL,
              lease_until=NULL,
              available_at=LEAST(
                available_at,
                $1
              ),
              updated_at=$1
          FROM stale
          WHERE o.event_id=stale.event_id
          `,
          now,
          limit,
        );

      return updated;
    },

    async stats(now) {
      const rows =
        await prisma.$queryRawUnsafe<
          Array<{
            pending: number;
            processing: number;
            completed: number;
            failed: number;
            expired_leases: number;
            max_attempts: number;
            oldest_pending_at:
              Date | null;
          }>
        >(
          `
          SELECT
            COUNT(*) FILTER (
              WHERE state='pending'
            )::int AS pending,
            COUNT(*) FILTER (
              WHERE state='processing'
            )::int AS processing,
            COUNT(*) FILTER (
              WHERE state='completed'
            )::int AS completed,
            COUNT(*) FILTER (
              WHERE state='failed'
            )::int AS failed,
            COUNT(*) FILTER (
              WHERE state='processing'
                AND lease_until IS NOT NULL
                AND lease_until <= $1
            )::int AS expired_leases,
            COALESCE(
              MAX(attempts),
              0
            )::int AS max_attempts,
            MIN(created_at) FILTER (
              WHERE state IN ('pending','processing')
            ) AS oldest_pending_at
          FROM powerchain_runtime_outbox
          `,
          now,
        );

      const row =
        rows[0] ?? {
          pending: 0,
          processing: 0,
          completed: 0,
          failed: 0,
          expired_leases: 0,
          max_attempts: 0,
          oldest_pending_at: null,
        };

      return {
        pending:
          Number(row.pending),
        processing:
          Number(
            row.processing,
          ),
        completed:
          Number(
            row.completed,
          ),
        failed:
          Number(row.failed),
        expiredLeases:
          Number(
            row.expired_leases,
          ),
        maxAttempts:
          Number(
            row.max_attempts,
          ),
        oldestPendingAt:
          row.oldest_pending_at
            ?.toISOString(),
      };
    },
  };
}
