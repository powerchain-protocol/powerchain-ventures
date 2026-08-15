# Public Data Integrity

PowerChain generates SHA-256 fingerprints for canonical public data.

Current package fingerprints in this upgrade:

```text
pwrc.json             5c84df673dd4654580ed6c7ab89ff7269d6b520c0cc6e894b3a15c66a49ed906
public-registry.json  5c535800000ddcd895efb8b85705b6bdbd1abf726080def42b0b214677e6e4ed
```

The canonical integrity manifest is:

```text
packages/token-data/data/integrity.json
```

Generated client copies are stored under frontend and mobile assets.

## Runtime compatibility

Frontend and mobile now validate network payloads before accepting them. Unknown schema versions, wrong registry kinds, unsupported releases, missing PWRC data, invalid authority policy, or invalid verified-deployment state fail closed and trigger the existing stale snapshot fallback.

## API

`GET /api/v1/public-data/integrity`

This endpoint publishes public file fingerprints and contains no secrets.

## Release gates

```bash
pnpm public:data:integrity
pnpm public:data:integrity:sync
pnpm public:data:integrity:sync:check
```
