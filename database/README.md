# PowerChain Launchpad database

The authoritative production schema is PostgreSQL/Supabase and is evolved by the ordered SQL files in `migrations/`.

- `migrations/` — canonical, reviewable production migrations.
- `schemas/launchpad.sql` — consolidated schema snapshot for review/bootstrap.
- `prisma/schema.prisma` — Prisma ORM 7 companion model for typed server tooling; it does not replace SQL migrations.
- `supabase/` — Supabase deployment notes and RLS/security requirements.

Settlement-critical writes remain server-only and are guarded by PostgreSQL functions, row locks, RLS and the Supabase service role.


## Runtime persistence migrations

Migrations `028`–`035` add durable runtime rate-limit/idempotency/audit state, atomic mutation reservations and receipts, mutation leases, settlement/finality records, transactional outbox state, Better Auth wallet-account storage, and outbox operator diagnostics.

`schemas/launchpad.sql` is kept synchronized through migration `035`; production deployment should still apply the ordered files in `migrations/` rather than treating the snapshot as migration history.
