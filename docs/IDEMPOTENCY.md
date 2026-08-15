# Idempotency

PowerChain mutation endpoints should require idempotency for operations that may create financial or lifecycle state.

Recommended flow:

```text
validate request
→ normalize Idempotency-Key
→ canonical request fingerprint
→ read persistent idempotency record
→ conflict/replay/new
→ execute mutation
→ persist response atomically
```

The included memory-backed store is a development/runtime primitive. Production settlement must bind idempotency to persistent storage/transaction boundaries.
