import type {
  MutationLease,
  MutationLeasePersistence,
} from "@powerchain/token-data";

type PrismaLike = {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

function map(row: {
  mutation_id: string;
  owner_id: string;
  state: MutationLease["state"];
  lease_expires_at: Date;
  heartbeat_at: Date;
  attempt: number;
}): MutationLease {
  return {
    mutationId: row.mutation_id,
    ownerId: row.owner_id,
    state: row.state,
    leaseExpiresAt: new Date(row.lease_expires_at).toISOString(),
    heartbeatAt: new Date(row.heartbeat_at).toISOString(),
    attempt: row.attempt,
  };
}

export function createPrismaMutationLeasePersistence(
  prisma: PrismaLike,
): MutationLeasePersistence {
  return {
    async acquire(input) {
      const rows = await prisma.$queryRawUnsafe<Array<{
        mutation_id: string;
        owner_id: string;
        state: MutationLease["state"];
        lease_expires_at: Date;
        heartbeat_at: Date;
        attempt: number;
        acquired: boolean;
      }>>(
        `
        INSERT INTO powerchain_runtime_mutation_leases
          (mutation_id, owner_id, state, lease_expires_at, heartbeat_at, attempt)
        VALUES ($1, $2, 'active', $3, NOW(), 1)
        ON CONFLICT (mutation_id)
        DO UPDATE SET
          owner_id = CASE
            WHEN powerchain_runtime_mutation_leases.lease_expires_at <= NOW()
              OR powerchain_runtime_mutation_leases.owner_id = $2
            THEN $2
            ELSE powerchain_runtime_mutation_leases.owner_id
          END,
          state = CASE
            WHEN powerchain_runtime_mutation_leases.lease_expires_at <= NOW()
              OR powerchain_runtime_mutation_leases.owner_id = $2
            THEN 'active'
            ELSE powerchain_runtime_mutation_leases.state
          END,
          lease_expires_at = CASE
            WHEN powerchain_runtime_mutation_leases.lease_expires_at <= NOW()
              OR powerchain_runtime_mutation_leases.owner_id = $2
            THEN $3
            ELSE powerchain_runtime_mutation_leases.lease_expires_at
          END,
          heartbeat_at = CASE
            WHEN powerchain_runtime_mutation_leases.lease_expires_at <= NOW()
              OR powerchain_runtime_mutation_leases.owner_id = $2
            THEN NOW()
            ELSE powerchain_runtime_mutation_leases.heartbeat_at
          END,
          attempt = CASE
            WHEN powerchain_runtime_mutation_leases.lease_expires_at <= NOW()
              AND powerchain_runtime_mutation_leases.owner_id <> $2
            THEN powerchain_runtime_mutation_leases.attempt + 1
            ELSE powerchain_runtime_mutation_leases.attempt
          END
        RETURNING mutation_id, owner_id, state, lease_expires_at,
                  heartbeat_at, attempt, owner_id = $2 AS acquired
        `,
        input.mutationId,
        input.ownerId,
        input.leaseExpiresAt,
      );

      const row = rows[0];
      if (!row) throw new Error("Mutation lease acquire returned no row");
      const lease = map(row);
      return row.acquired
        ? { kind: "acquired", lease }
        : { kind: "busy", lease };
    },

    async heartbeat(input) {
      const updated = await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_mutation_leases
        SET heartbeat_at = NOW(),
            lease_expires_at = $3
        WHERE mutation_id = $1
          AND owner_id = $2
          AND state = 'active'
        `,
        input.mutationId,
        input.ownerId,
        input.leaseExpiresAt,
      );
      return updated === 1;
    },

    async complete(input) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_mutation_leases
        SET state = 'completed', heartbeat_at = NOW()
        WHERE mutation_id = $1 AND owner_id = $2
        `,
        input.mutationId,
        input.ownerId,
      );
    },

    async fail(input) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE powerchain_runtime_mutation_leases
        SET state = 'failed', heartbeat_at = NOW()
        WHERE mutation_id = $1 AND owner_id = $2
        `,
        input.mutationId,
        input.ownerId,
      );
    },

    async read(mutationId) {
      const rows = await prisma.$queryRawUnsafe<Array<{
        mutation_id: string;
        owner_id: string;
        state: MutationLease["state"];
        lease_expires_at: Date;
        heartbeat_at: Date;
        attempt: number;
      }>>(
        `
        SELECT mutation_id, owner_id, state, lease_expires_at, heartbeat_at, attempt
        FROM powerchain_runtime_mutation_leases
        WHERE mutation_id = $1
        LIMIT 1
        `,
        mutationId,
      );
      return rows[0] ? map(rows[0]) : null;
    },
  };
}
