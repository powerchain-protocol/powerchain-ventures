# PowerChain Launchpad API Contract

The backend application owns the API contract.

```text
apps/backend/api/openapi/
├── openapi.yaml
├── swagger.config.json
└── README.md
```

`openapi.yaml` is the only canonical OpenAPI source in the monorepo.

- Machine contract: `GET /api/v1/openapi`
- Discovery metadata: `GET /api/v1/swagger`
- Human docs: `/docs/api`

Run `pnpm openapi:check` after changing API routes or schemas.

Do not add root-level or generated Swagger/OpenAPI copies.
