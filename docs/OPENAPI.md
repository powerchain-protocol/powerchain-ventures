# OpenAPI and Swagger

The API contract is owned by the backend application.

## Canonical source

```text
apps/backend/api/openapi/openapi.yaml
```

There are no generated/root duplicate specifications.

## Routes

```text
GET /api/v1/openapi
GET /api/v1/swagger
```

Human developer documentation:

```text
/docs/api
```

## Validation

```bash
pnpm openapi:check
```

API route/schema changes must update the canonical YAML and corresponding regression tests in the same change.
