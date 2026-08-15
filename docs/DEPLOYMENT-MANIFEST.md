# Deployment Manifest

Machine-readable deployment expectations live at:

```text
packages/token-data/data/deployment-manifest.json
```

Validate with:

```bash
pnpm --filter @powerchain/token-data validate:deployment
```

The manifest records release, schema version, network, required public endpoints, and security invariants.

It intentionally records PWRC as `configuration-ready` until verified deployment identifiers are available.
