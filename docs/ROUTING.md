# Routing

PowerChain uses Next.js App Router for frontend and backend applications.

## Rules

- UI routes live under `apps/frontend/app`.
- API/backend routes live under `apps/backend/app/api`.
- Do not duplicate the same logical route through route groups.
- A segment should not contain both `page.tsx` and `route.ts`.
- Shared API paths are documented in OpenAPI and validated against the backend filesystem.
- Dynamic route parameters use App Router folder syntax such as `[mutationId]`.

## API namespace

Stable APIs use:

```text
/api/v1/*
```

Examples:

```text
/api/v1/token
/api/v1/public-data
/api/v1/public-data/health
/api/v1/public-data/meta
/api/v1/public-data/integrity
/api/v1/version
/api/v1/capabilities
/api/v1/readiness
/api/v1/mutations/{mutationId}
/api/v1/settlements/{settlementId}
```

## Route validation

The repository includes:

```text
docs/ROUTING-INVENTORY.json
docs/MONOREPO-ORGANIZATION-REPORT.json
```

and source validators that detect route/config drift.

When adding API routes, update the OpenAPI contract and relevant tests in the same change.
