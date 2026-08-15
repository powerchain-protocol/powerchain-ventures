# GET /api/v1/public-data

Returns the canonical PowerChain public registry.

Response headers include:
- `ETag`
- `Cache-Control`
- `X-PowerChain-Data-Source`
- `X-PowerChain-Schema-Version`

The endpoint contains no secrets and may be cached publicly.

A matching `If-None-Match` value returns `304 Not Modified`.

Clients must not use this endpoint as authority for sale settlement, eligibility, claimable balances, or transaction verification.
