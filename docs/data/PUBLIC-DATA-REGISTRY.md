# Public Data Registry

PowerChain Launchpad exposes one versioned public-data registry for protocol metadata used by web and mobile clients.

## Boundary

Static/canonical:
- PWRC identity and fixed supply
- Token-2022 extension policy
- public fee policy
- deployment state and verified addresses when available

Dynamic/backend-owned:
- sale lifecycle state
- sold/remaining allocation
- participant counts
- eligibility
- claims
- settlement
- transaction verification

Static snapshots are informational fallbacks only and never become payment or settlement authority.

## API

`GET /api/v1/public-data`

The route returns a schema-versioned envelope and supports ETag / 304 responses.

## Client behavior

Frontend and mobile attempt the network route first. If unavailable, they use the generated snapshot and expose `stale: true` to the UI.

## Drift gates

```bash
pnpm public:data:validate
pnpm public:data:sync
pnpm public:data:sync:check
```
