# Public Data Observability

PowerChain exposes explicit health and metadata endpoints for the public-data layer.

## Endpoints

- `GET /api/v1/public-data`
- `GET /api/v1/public-data/health`
- `GET /api/v1/public-data/meta`
- `GET /api/v1/public-data/integrity`

`/health` is non-cacheable and returns `503` when the canonical public-data contract becomes invalid.

`/meta` is cacheable and reports schema/release/registry information.

## Operational intent

A token in `configuration-ready` state is valid and does not fail readiness. A token marked `verified` without a verified mint must fail readiness.

The public-data layer is not settlement authority. These endpoints are for protocol metadata, diagnostics, compatibility, and client display.
