# Validation Snapshots

Machine-readable validation/report snapshots live here instead of the repository root.

These files record point-in-time checks. Re-run the current repository gates before deployment:

```bash
pnpm doctor:workspace
pnpm doctor:types
pnpm validate
pnpm typecheck
pnpm build
```
