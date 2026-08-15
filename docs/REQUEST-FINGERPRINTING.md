# Request Fingerprinting

Mutation idempotency binds a normalized idempotency key to a deterministic SHA-256 request fingerprint.

Fingerprint input:

```text
HTTP method
request path
canonical JSON body
```

Object keys are sorted recursively before hashing. Token amounts should already be normalized to canonical string/base-unit representations before fingerprinting.

The same idempotency key with a different fingerprint is a conflict and must not execute the mutation.
