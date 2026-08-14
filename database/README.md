# PowerChain Launchpad database

The authoritative production schema is PostgreSQL/Supabase and is evolved by the ordered SQL files in `migrations/`.

- `migrations/` — canonical, reviewable production migrations.
- `schemas/launchpad.sql` — consolidated schema snapshot for review/bootstrap.
- `prisma/schema.prisma` — Prisma ORM 7 companion model for typed server tooling; it does not replace SQL migrations.
- `supabase/` — Supabase deployment notes and RLS/security requirements.

Settlement-critical writes remain server-only and are guarded by PostgreSQL functions, row locks, RLS and the Supabase service role.
