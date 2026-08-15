# Production Runtime Check

Run:

```bash
pnpm runtime:startup:check
pnpm runtime:protection:check
pnpm production:runtime:check
```

The composed runtime gate validates required protection modules, the runtime manifest, environment/security gates, and the production release checks.
