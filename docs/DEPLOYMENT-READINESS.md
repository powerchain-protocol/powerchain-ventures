# Deployment Readiness

PowerChain Launchpad exposes an aggregate readiness endpoint:

```text
GET /api/v1/readiness
```

This endpoint combines public-data validation and runtime capability checks.

A `configuration-ready` PWRC profile is valid. If PWRC is later marked `verified`, a verified mint address becomes mandatory.

## Capabilities

```text
GET /api/v1/capabilities
```

The response advertises supported product capabilities without exposing environment secrets.

Native mobile signing remains explicitly disabled until a reviewed native signing adapter is selected.

## Deployment preflight

```bash
pnpm deployment:check
```

The preflight validates required production files, version policy, environment-example boundaries, and readiness/capability routes.
