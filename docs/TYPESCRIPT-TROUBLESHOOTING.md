# TypeScript dependency troubleshooting

PowerChain Launchpad is a pnpm workspace. Run installs from the repository root so Next.js, React, React DOM, their type packages, and all `workspace:*` packages are linked consistently.

## Missing React / React DOM / Node / Next types

Symptoms include:

- `Cannot find type definition file for 'react'`
- `Cannot find type definition file for 'react-dom'`
- `Cannot find module 'node:path'`
- `Cannot find name 'process'`
- `Cannot find module 'next'`

From the repository root:

```bash
corepack enable
pnpm install
pnpm doctor:types
pnpm typecheck
```

Do not run `npm install` separately inside `apps/frontend` or `apps/backend`. The applications depend on local `workspace:*` packages and should be installed as one workspace.

If a previous install is incomplete:

```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf apps/*/.next
pnpm install
pnpm doctor:types
pnpm typecheck
```

In VS Code, use **TypeScript: Select TypeScript Version → Use Workspace Version**, then run **TypeScript: Restart TS Server**. The checked-in `.vscode/settings.json` points VS Code at the root workspace TypeScript SDK after dependencies are installed.

`next-env.d.ts` is maintained by Next.js; do not hand-edit it to work around missing packages.
