# Prisma companion schema

PowerChain uses SQL migrations as the source of truth. Prisma ORM is a typed companion for backend tooling and future repository services.

Run from the repository root:

```bash
pnpm prisma:validate
pnpm prisma:generate
```

Prisma 7 configuration lives in `/prisma.config.ts`. `DATABASE_URL` is server-only.
