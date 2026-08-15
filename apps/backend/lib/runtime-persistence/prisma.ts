import type {
  AuditPersistence,
  IdempotencyPersistence,
  RateLimitPersistence,
} from "@powerchain/token-data";

type PrismaLike = {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

export function createPrismaRateLimitPersistence(prisma: PrismaLike): RateLimitPersistence {
  return {
    async health() {
      await prisma.$queryRawUnsafe(
        "SELECT 1 FROM powerchain_runtime_rate_limits LIMIT 1",
      );
    },

    async consume(input) {
      const rows = await prisma.$queryRawUnsafe<Array<{
        count: number;
        reset_at: Date;
      }>>(
        `
        INSERT INTO powerchain_runtime_rate_limits
          (bucket, identity_hash, count, reset_at, updated_at)
        VALUES ($1, $2, 1, $3, $4)
        ON CONFLICT (bucket, identity_hash)
        DO UPDATE SET
          count = CASE
            WHEN powerchain_runtime_rate_limits.reset_at <= $4 THEN 1
            ELSE powerchain_runtime_rate_limits.count + 1
          END,
          reset_at = CASE
            WHEN powerchain_runtime_rate_limits.reset_at <= $4 THEN $3
            ELSE powerchain_runtime_rate_limits.reset_at
          END,
          updated_at = $4
        RETURNING count, reset_at
        `,
        input.bucket,
        input.identityHash,
        new Date(input.now.getTime() + input.windowSeconds * 1000),
        input.now,
      );

      const row = rows[0];
      if (!row) throw new Error("Rate limit persistence returned no row");
      return {
        allowed: row.count <= input.limit,
        remaining: Math.max(0, input.limit - row.count),
        resetAt: new Date(row.reset_at),
      };
    },
  };
}

export function createPrismaIdempotencyPersistence(prisma: PrismaLike): IdempotencyPersistence {
  return {
    async read(key) {
      const rows = await prisma.$queryRawUnsafe<Array<{
        fingerprint: string;
        status_code: number;
        response_body: unknown;
        expires_at: Date;
      }>>(
        `
        SELECT fingerprint, status_code, response_body, expires_at
        FROM powerchain_runtime_idempotency
        WHERE idempotency_key = $1 AND expires_at > NOW()
        LIMIT 1
        `,
        key,
      );
      const row = rows[0];
      if (!row) return null;
      return {
        fingerprint: row.fingerprint,
        statusCode: row.status_code,
        body: row.response_body,
        expiresAt: new Date(row.expires_at),
      };
    },

    async create(input) {
      const inserted = await prisma.$executeRawUnsafe(
        `
        INSERT INTO powerchain_runtime_idempotency
          (idempotency_key, fingerprint, status_code, response_body, expires_at)
        VALUES ($1, $2, $3, $4::jsonb, $5)
        ON CONFLICT (idempotency_key) DO NOTHING
        `,
        input.key,
        input.fingerprint,
        input.statusCode,
        JSON.stringify(input.body),
        input.expiresAt,
      );
      return inserted > 0 ? "created" : "exists";
    },
  };
}

export function createPrismaAuditPersistence(prisma: PrismaLike): AuditPersistence {
  return {
    async health() {
      await prisma.$queryRawUnsafe(
        "SELECT 1 FROM powerchain_runtime_audit LIMIT 1",
      );
    },

    async append(input) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO powerchain_runtime_audit
          (event, request_id, route, status, code, metadata, occurred_at)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
        `,
        input.event,
        input.requestId ?? null,
        input.route ?? null,
        input.status ?? null,
        input.code ?? null,
        JSON.stringify(input.metadata ?? {}),
        input.occurredAt,
      );
    },
  };
}
