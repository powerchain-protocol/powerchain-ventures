# Contributors

Thank you for contributing to PowerChain Launchpad™.

## Development principles

Contributions should preserve:

- PowerChain-only branding
- release version `1.0.0` unless a version change is explicitly approved
- Solana Token-2022 compatibility
- wallet self-custody
- server/client secret boundaries
- persistent idempotency for financial mutations
- fail-closed deployment configuration
- settlement completion only after finality and reconciliation

## Before opening a change

Run:

```bash
pnpm doctor:workspace
pnpm validate
pnpm typecheck
pnpm test
```

Run the relevant production checker when modifying runtime, security, API, database, or settlement code.

## Pull requests

A useful pull request explains:

1. what changed,
2. why it is needed,
3. which application/package is affected,
4. whether migrations or environment changes are required,
5. which tests/checkers were run,
6. any remaining deployment-sensitive assumptions.

Do not commit credentials, `.env.local`, private keys, seed phrases, service-role keys, API secrets, or generated dependency/build directories.
