# Production Security Preflight

Run before production build/deploy:

```bash
pnpm production:security:check
pnpm production:final:check
pnpm typecheck
pnpm build
```

The security preflight checks:

- environment-example separation
- server-only credentials are not referenced from mobile code
- public routes do not directly reference private credentials
- deployment manifest invariants
- release remains `1.0.0`
