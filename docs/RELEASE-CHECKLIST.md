# Release Checklist

## Source and workspace

- [ ] version remains `1.0.0`
- [ ] no `payload/`
- [ ] no `node_modules`, `.next`, `.turbo`, `.expo` committed
- [ ] no tracked `.env.local`
- [ ] workspace package filters resolve
- [ ] route inventory has no duplicate logical routes

## Security

- [ ] no credentials in client/mobile source
- [ ] environment examples contain placeholders only
- [ ] public routes do not reference server secrets
- [ ] runtime persistence is database-backed for horizontal production

## Database

- [ ] migrations reviewed
- [ ] migrations applied
- [ ] Prisma client generated
- [ ] cleanup/retention policy reviewed

## Runtime

- [ ] idempotency enabled
- [ ] atomic reservation enabled
- [ ] mutation receipt persistence healthy
- [ ] mutation lease persistence healthy
- [ ] audit persistence healthy

## Settlement

- [ ] settlement state machine enabled
- [ ] Solana finality observer configured
- [ ] outbox worker configured
- [ ] reconciliation bounded
- [ ] manual-review path monitored
- [ ] no workflow marks financial settlement complete before `reconciled`

## Build

- [ ] `pnpm validate`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] release readiness report generated
