# Authentication and Wallet Identity

PowerChain now uses two complementary authentication systems:

1. Better Auth for email/password and social OAuth.
2. Cryptographic wallet authentication for Solana ownership proof.

## Better Auth

Server route:

```text
/api/auth/[...all]
```

The frontend proxies the same route so OAuth cookies remain same-origin.

Configured social providers are enabled only when both client ID and secret are
present:

- Google
- GitHub
- Discord
- Apple

Better Auth stores core user/session/account/verification data in PostgreSQL.
Migration `034_better_auth_wallet_accounts.sql` adds the required tables and a
PowerChain wallet-identity table.

## Solana sign-in

Wallet sign-in is not a transaction.

The server challenge binds:

- wallet address
- application URI
- Solana cluster
- cryptographically random nonce
- issued/expiration time
- request ID

The connected wallet signs the exact UTF-8 message. The backend verifies the
64-byte Ed25519 signature against the Solana public key before creating a
short-lived HTTP-only wallet session.

Transaction signatures are never reused as login signatures.

## Embedded wallets

Embedded-wallet integrations are provider adapters. PowerChain never receives
or persists a seed phrase/private key. `EMBEDDED_WALLET_PROVIDER=disabled` is
the fail-closed default.


## Route ownership

Better Auth protocol endpoints:

```text
/api/auth/*
```

PowerChain-owned auth API:

```text
GET  /api/v1/auth/providers
GET  /api/v1/auth/session
POST /api/v1/auth/wallet/challenge
POST /api/v1/auth/wallet/verify
POST /api/v1/auth/wallet/sign-out
```

This keeps Better Auth's standard OAuth/cookie callback contract intact while
PowerChain-specific wallet identity remains versioned under API v1.
