# Mobile toolchain and TypeScript stabilization

Date: 2026-08-14
Version: 1.0.0

## Fixed

- `pnpm mobile:doctor` no longer relies on an ambiguous `expo-doctor` shell lookup. The mobile workspace pins `expo-doctor@1.20.1` and invokes it through `pnpm exec expo-doctor`.
- Expo is aligned to the installed SDK 57 patch line at `~57.0.12`.
- `Page` accepts async refresh handlers and explicit `undefined` under `exactOptionalPropertyTypes`.
- `Field` and the shared UI optional props accept explicit `undefined` where React callers commonly forward optional state.
- `Button` forwards the complete React Native/Expo Pressable style callback state rather than reconstructing `{ pressed }`, preserving web fields such as `hovered`.
- The known `uuid@7.0.3` and `uuid@8.3.2` deprecation messages are narrowly muted via pnpm's `allowedDeprecatedVersions`. This does not override or upgrade those transitive packages.
- `react-native-screens` remains pinned exactly to `4.26.0`.

## Verification

- Root regression tests: 111/111 passing.
- Focused utils tests: 9/9 passing.
- Workspace/repository/pnpm/Vercel/env/native/OpenAPI checks: passing.
- TS/TSX syntax transpilation: 258/258 implementation files passing.

A dependency-backed Expo `tsc --noEmit` must be run in the installed local workspace because this artifact runtime does not contain the user's pnpm dependency graph.
