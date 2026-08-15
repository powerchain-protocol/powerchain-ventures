# @powerchain/token-data

Canonical shared PowerChain token/public/runtime contracts.

## Owns

- PWRC public token profile
- public registry and integrity manifests
- API schema/version metadata
- runtime resilience/error contracts
- cache/security policy
- idempotency/fingerprint contracts
- mutation contracts
- mutation lease/recovery contracts
- settlement/finality contracts
- outbox/reconciliation contracts
- validators and fixtures

Applications should import these contracts rather than redefining them.

## Validation

```bash
pnpm --filter @powerchain/token-data validate:data
pnpm --filter @powerchain/token-data validate:registry
pnpm --filter @powerchain/token-data validate:integrity
pnpm --filter @powerchain/token-data validate:deployment
pnpm --filter @powerchain/token-data validate:runtime-protection
```
