# Public Data OpenAPI Contract

The public-data API contract is stored at:

```text
packages/token-data/data/public-api.openapi.json
```

The contract covers:

- `GET /api/v1/token`
- `GET /api/v1/public-data`
- `GET /api/v1/public-data/health`
- `GET /api/v1/public-data/meta`
- `GET /api/v1/public-data/integrity`
- `GET /api/v1/version`

`validate:api` checks that each documented path has a corresponding backend App Router route.

The public-data contract is versioned independently from dynamic sale data. Breaking changes require a new API/schema version rather than silently changing v1.
