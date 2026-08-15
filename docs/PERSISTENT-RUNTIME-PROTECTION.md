# Persistent Runtime Protection

PowerChain runtime protection now uses adapter contracts for shared persistence.

## Production adapters

The backend includes:

- `RateLimitPersistence`
- `IdempotencyPersistence`
- `AuditPersistence`
- memory adapter for development/fallback
- Prisma/PostgreSQL adapter for shared production state

## Database tables

Migration `028_runtime_protection.sql` creates:

- `powerchain_runtime_rate_limits`
- `powerchain_runtime_idempotency`
- `powerchain_runtime_audit`

Migration `029_runtime_protection_cleanup.sql` adds bounded-retention cleanup.

## Production requirement

Horizontally scaled deployments should configure the database-backed adapter at application startup. The in-memory adapter remains available for local development and fail-safe test environments, but is not sufficient for cross-instance enforcement.
