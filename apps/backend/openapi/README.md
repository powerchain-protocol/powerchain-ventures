# PowerChain Launchpad API specification

`powerchain-launchpad.openapi.yaml` is the canonical OpenAPI 3.1 source for the backend. It lives with the backend because the backend owns the HTTP contract.

- Runtime spec: `GET /api/v1/openapi`
- Swagger-compatible generated spec: `swagger.yaml`
- Swagger/tooling metadata: `swagger.config.json`
- Regenerate copies: `pnpm openapi:sync`
- Root `/openapi` directory: compatibility pointer only; do not edit it as the source of truth.

The API never exposes Helius/Birdeye keys, Supabase service credentials, private RPC credentials, private wallet material or serialized transaction plans through documentation/status endpoints.
