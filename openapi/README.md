# OpenAPI / Swagger compatibility

The canonical source is `../apps/backend/openapi/powerchain-launchpad.openapi.yaml`.

`openapi.yaml` is a generated compatibility copy for repository-level tooling. `apps/backend/openapi/swagger.yaml` is the generated Swagger-compatible copy. Run `pnpm openapi:sync` after editing the canonical backend spec and `pnpm openapi:check` in CI.
