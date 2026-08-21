# PowerChain Ventures — Database v1.7.0

The canonical Prisma schema is `apps/api/prisma/schema.prisma` and targets PostgreSQL.

Core models cover Better Auth (`User`, `Session`, `Account`, `Verification`), wallet links, launch configuration, sale phases, participation, eligibility, vesting, claims, authorities, settlements, chain transactions, audit events and user preferences.

For Supabase-hosted PostgreSQL, `DATABASE_URL` may use the pooled application connection and `DIRECT_URL` should use the direct migration connection. Supabase Auth is not the canonical application session provider; Better Auth owns application sessions.

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:deploy
pnpm db:seed
pnpm db:studio
```

`POWERCHAIN_DATA_MODE=mock` affects launch-domain repositories only. Better Auth still requires its database models whenever auth endpoints are used. Production should run `prisma migrate deploy` before enabling registration or launch writes.
