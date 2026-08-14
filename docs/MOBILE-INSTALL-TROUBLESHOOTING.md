# PowerChain Mobile — Expo workspace troubleshooting

## Symptoms

These errors usually appear together when `apps/mobile` has not been linked by the root pnpm workspace install:

- `Cannot find module 'react-native'`
- `Cannot find module 'expo-router'`
- `Cannot find module '@/…'`
- `File 'expo/tsconfig.base' not found`
- `ConfigError: Cannot determine the project's Expo SDK version because the module expo is not installed`

PowerChain uses a pnpm monorepo. Do not run `npm install` inside `apps/mobile`.

## Recovery

From the repository root:

```bash
corepack enable
pnpm install --no-frozen-lockfile
pnpm mobile:bootstrap
pnpm mobile:doctor
pnpm mobile:typecheck
```

If Metro or the editor still has stale state:

```bash
pnpm mobile:clean
pnpm dev:mobile
```

Then restart the VS Code TypeScript server and select the workspace TypeScript version.

## TypeScript

The mobile `tsconfig.json` is deliberately self-contained for JSX, Bundler module resolution, React Native conditions, and `@/* -> src/*` aliases. This prevents alias/JSX diagnostics from cascading merely because Expo has not yet been linked. Expo itself is still a required runtime/build dependency.

## Metro

Expo SDK 52+ automatically configures monorepo resolution when using `expo/metro-config`. PowerChain therefore keeps `metro.config.js` minimal and does not override `watchFolders`, `nodeModulesPaths`, or hierarchical resolution.

## Deprecated uuid warnings

Warnings for `uuid@7` or `uuid@8` are transitive dependency notices. PowerChain does not force a major-version override across Expo's dependency graph. Use `pnpm why uuid` to identify the upstream package and upgrade through Expo-compatible package versions.
