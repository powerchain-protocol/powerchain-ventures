# Runtime Persistence Cleanup

The cleanup service removes:

- expired rate-limit windows
- expired idempotency records
- audit events older than the configured retention window

`database/migrations/029_runtime_protection_cleanup.sql` also provides a database cleanup function.

Schedule cleanup through the deployment scheduler/database scheduler at an operationally appropriate interval. Cleanup must never delete active idempotency records.
