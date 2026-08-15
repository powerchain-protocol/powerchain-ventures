# Runtime Protection

PowerChain Launchpad now includes reusable runtime request-protection primitives.

## Included

- origin validation
- request identity extraction
- request rate limiting
- typed 429 problem responses
- idempotency-key validation
- replay/conflict store primitives
- structured audit events
- startup validation

## Rate limiting

The included implementation is a bounded in-process default. It is appropriate for local development, single-instance deployments, and as a safe fallback.

For horizontally scaled production deployments, use a shared persistence-backed implementation while keeping the same `RateLimitResult` contract.

The runtime manifest deliberately records this limitation instead of pretending an in-memory map provides distributed enforcement.

## Idempotency

Mutation endpoints should fingerprint the normalized request body and bind it to `Idempotency-Key`.

A repeated key with the same fingerprint may replay the prior response. The same key with a different fingerprint must return a conflict.

Settlement/claim state still requires persistent database-backed idempotency in multi-instance production.
