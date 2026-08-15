# Database

PostgreSQL/Supabase provides persistent application and runtime state.

## Runtime migrations

Recent runtime hardening migrations include:

```text
028_runtime_protection.sql
029_runtime_protection_cleanup.sql
030_runtime_mutation_receipts.sql
031_atomic_idempotency_reservations.sql
032_mutation_leases.sql
033_settlement_finality.sql
```

These cover:

- distributed rate-limit counters
- persistent idempotency
- audit records
- mutation receipts
- atomic idempotency reservations
- mutation leases
- settlement records
- transactional outbox
- cleanup/retention

## Migration policy

- Never edit an already-applied production migration in place.
- Add a new forward migration.
- Use transactions where supported.
- Add indexes for operational lookup paths.
- Preserve idempotency and settlement history.
- Do not remove active reconciliation records without an explicit migration/retention plan.

## Production boot order

```text
database reachable
→ migrations applied
→ Prisma/client generated
→ runtime persistence adapter configured
→ readiness healthy
→ mutation traffic enabled
```
