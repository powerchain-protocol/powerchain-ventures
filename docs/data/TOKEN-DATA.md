# Public Token Data Architecture

`@powerchain/token-data` is the public protocol-data boundary for PWRC and sale metadata.

## Data flow

```text
packages/token-data
   ├── typed TypeScript profile
   ├── canonical JSON
   └── JSON schema
          │
          ├── backend /api/v1/token
          ├── frontend static/runtime token data
          └── mobile static/runtime token data
```

The backend endpoint is public, contains no secrets, supports ETag validation and CDN caching, and returns only canonical public token/fee information.

Frontend and mobile keep a generated canonical snapshot as a fail-safe for informational display. Settlement logic must never use the public snapshot as an authority for payment, allocation, eligibility, or transaction verification.

## Release gates

```bash
pnpm token:data:validate
pnpm token:data:sync
pnpm token:data:sync:check
pnpm token:data:test
```

`sync:check` fails when frontend/mobile snapshots drift from the canonical package.
