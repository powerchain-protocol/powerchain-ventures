# GET /api/v1/token

Returns the canonical public PowerChain/PWRC token profile.

## Response

The payload contains:

- public token identity and supply
- Token-2022 extension policy
- public authority policy
- deployment state
- verified mint/metadata addresses when available
- public PowerChain fee policy
- schema/source metadata

The route emits `ETag` and cache-control headers. A matching `If-None-Match` request receives `304 Not Modified`.

No private provider keys, signing material, Supabase service-role credentials, quote-authority keys, or transaction-builder secrets are returned by this endpoint.
