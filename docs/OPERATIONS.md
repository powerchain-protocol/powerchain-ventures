# Operations

## Health

Use API health/readiness endpoints for operational checks.

Key signals include:

- public-data health
- runtime persistence health
- aggregate readiness
- mutation receipt state
- settlement state
- outbox backlog
- reconciliation retries/manual review

## Runtime persistence

Horizontal production deployments must use shared database-backed adapters. In-memory adapters are only suitable for development, tests, or explicitly single-instance fallback behavior.

## Cleanup

Cleanup jobs remove:

- expired rate-limit windows
- expired idempotency entries
- completed/failed mutation leases after retention
- old audit data according to policy
- completed/failed outbox records after retention

Never delete active processing or unreconciled settlement state.

## Incident handling

For a stuck financial mutation:

1. identify the request/mutation/settlement IDs,
2. inspect the mutation receipt,
3. inspect idempotency reservation,
4. inspect mutation lease,
5. inspect settlement record,
6. inspect known Solana signature,
7. determine chain finality,
8. reconcile before any retry.

Do not blindly resubmit.
