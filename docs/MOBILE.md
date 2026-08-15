# Mobile

The native companion lives under `apps/mobile`.

## Stack

- Expo
- React Native
- Expo Router
- TypeScript
- SecureStore-backed auth/session handling

`react-native-screens` is pinned exactly to `4.26.0`.

## Security boundary

Only browser/native-safe public configuration belongs in the mobile bundle.

Never expose:

- Supabase service-role keys
- RPC provider secrets
- CDP API secrets
- private/signing keys
- seed phrases

## Signing

Native Solana signing remains explicitly fail-closed until a reviewed adapter is selected and wired.

The app must not pretend a transaction was signed/submitted if a native signer is unavailable.
