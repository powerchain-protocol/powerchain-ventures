# @powerchain/utils

Shared runtime-safe utilities for PowerChain Launchpad™ `1.0.0`.

## Modules

- `@powerchain/utils/helpers` — Solana address checks, bigint parsing/formatting, safe URLs, timeouts, secret redaction.
- `@powerchain/utils/http` — request IDs, idempotency keys, bounded retry policy, `Retry-After` parsing, request timeouts.
- `@powerchain/utils/utils/errors` — typed PowerChain errors, HTTP status mapping, API error parsing/normalization.

## Rules

- Keep utilities deterministic unless randomness is explicitly part of request IDs/backoff jitter.
- Never log secret values; use `redactSecret` only for server-side diagnostics.
- Mutation HTTP calls may retry only when an idempotency key is provided.
- Financial/token quantities remain strings or `bigint`; do not introduce floating-point settlement math.

## Tests

```bash
pnpm --filter @powerchain/utils test
```

The package test script builds `dist/` first and executes the focused Node test suite in `packages/utils/tests/`.
