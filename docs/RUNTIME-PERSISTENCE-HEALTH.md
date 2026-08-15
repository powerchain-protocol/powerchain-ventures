# Runtime Persistence Health

Endpoint:

```text
GET /api/v1/runtime/persistence/health
```

Checks:

- rate-limit persistence
- idempotency persistence
- audit persistence

It returns `503` if any required runtime persistence subsystem is unavailable.

In production, configure the database-backed runtime persistence adapter during backend startup before serving mutation traffic.
