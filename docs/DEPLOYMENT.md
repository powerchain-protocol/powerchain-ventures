# Deployment

## Preflight

```bash
corepack enable
corepack prepare pnpm@11.21.0 --activate
pnpm install
pnpm prisma:generate
pnpm doctor:workspace
pnpm validate
pnpm typecheck
pnpm test
pnpm build
```

Then run critical production gates:

```bash
pnpm production:security:check
pnpm production:settlement:check
pnpm release:readiness:report
```

## Database

Apply migrations before mutation traffic is enabled.

## Runtime persistence

Configure the database-backed runtime persistence adapter at backend startup.

## Environment

Use verified deployment values. Do not invent:

- PWRC mint
- metadata account
- Launchpad program ID
- quote authority
- funded vault
- provider credentials

## Rollout

Recommended order:

```text
database migration
→ backend deploy
→ readiness validation
→ frontend deploy
→ mobile release
→ monitor outbox/reconciliation
```

## Rollback

Do not roll back database state by deleting production history. Use forward migrations and application rollback compatible with the migrated schema.
