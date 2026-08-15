# API

PowerChain Launchpad exposes versioned API routes from `apps/backend`.

## Public metadata

Public endpoints are read-only and do not carry session credentials.

Core metadata endpoints:

```text
GET /api/v1/token
GET /api/v1/public-data
GET /api/v1/public-data/health
GET /api/v1/public-data/meta
GET /api/v1/public-data/integrity
GET /api/v1/version
GET /api/v1/capabilities
GET /api/v1/readiness
```

## Mutation status

```text
GET /api/v1/mutations/{mutationId}
GET /api/v1/settlements/{settlementId}
```

Financial mutation endpoints should use the shared idempotent mutation framework.

## Problem responses

Operational failures use a typed JSON problem response with:

- HTTP status
- stable code
- title/detail
- request ID
- release metadata

Never expose internal stack traces, provider credentials, signing material, session cookies, or raw secrets.

## Compatibility

Breaking changes to documented response fields, field types, numeric units, settlement meaning, or required semantics require an explicit new API/schema version.

Additive optional fields are compatible.

## OpenAPI

The canonical API contract is stored under the shared token-data package and mirrored/surfaced through the repository OpenAPI assets.

Run the API contract validator before release.


## Payments and protocol APIs

```text
GET     /api/v1/payments/config
OPTIONS /api/v1/payments/solana-pay/transaction
GET     /api/v1/payments/solana-pay/transaction?reviewId=...
POST    /api/v1/payments/solana-pay/transaction?reviewId=...
GET     /api/v1/payments/solana-pay/status?reviewId=...
GET     /api/v1/solana/settlement?signature=...
GET     /api/v1/protocols
GET     /api/v1/protocols/cctp/messages?sourceDomain=...&transactionHash=...
```

The Solana Pay transaction request returns an already-prepared buyer-bound transaction. It does not create a second quote or bypass PowerChain settlement verification.

CCTP and ZK protocol metadata are capability-gated; their presence in the protocol inventory is not equivalent to an active purchase adapter.
