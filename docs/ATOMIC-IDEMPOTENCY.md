# Atomic Idempotency

The mutation executor now reserves an idempotency key before executing application logic.

## Concurrency behavior

```text
request A
→ INSERT reservation
→ reserved
→ execute

request B with same key/fingerprint
→ reservation already exists
→ state=reserved
→ 409 mutation in progress
→ Retry-After: 1
```

After execution, the reservation becomes `completed` or `failed` with the persisted response.

A request using the same key with a different fingerprint is rejected as an idempotency conflict.

This closes the earlier race where two requests could both execute before an idempotency result had been persisted.
