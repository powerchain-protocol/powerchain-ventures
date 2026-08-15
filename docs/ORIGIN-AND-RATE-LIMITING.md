# Origin Validation and Rate Limiting

Browser origins are normalized before comparison. Server-to-server requests without an `Origin` header remain valid unless a route chooses stricter behavior.

Public metadata and health traffic use different policy buckets.

Rate-limit responses use HTTP `429`, `Retry-After`, `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`.

Do not use client-supplied wallet addresses or idempotency keys as the only anti-abuse identity.
