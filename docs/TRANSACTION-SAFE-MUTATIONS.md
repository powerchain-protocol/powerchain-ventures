# Transaction-Safe Mutations

PowerChain mutation handlers can now use one idempotent execution helper.

## Flow

```text
request
→ request ID
→ validate Idempotency-Key
→ canonical request fingerprint
→ persistent idempotency read
→ replay / conflict / execute
→ persist result
→ return Idempotency-Replayed header
```

Recommended mutation classes:

- purchases
- claims
- creator sale creation
- creator sale update
- complete/cancel lifecycle actions

For financial settlement, the `execute` callback should perform its database changes and settlement state transitions inside the existing database transaction boundary.
