type PrismaLike = {
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

export async function cleanupRuntimePersistence(prisma: PrismaLike): Promise<{
  rateLimits: number;
  idempotency: number;
  audit: number;
}> {
  const rateLimits = await prisma.$executeRawUnsafe(`
    DELETE FROM powerchain_runtime_rate_limits
    WHERE reset_at < NOW() - INTERVAL '10 minutes'
  `);

  const idempotency = await prisma.$executeRawUnsafe(`
    DELETE FROM powerchain_runtime_idempotency
    WHERE expires_at < NOW()
  `);

  const audit = await prisma.$executeRawUnsafe(`
    DELETE FROM powerchain_runtime_audit
    WHERE occurred_at < NOW() - INTERVAL '90 days'
  `);

  return { rateLimits, idempotency, audit };
}
