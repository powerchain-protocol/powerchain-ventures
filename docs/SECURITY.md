# Security

## Wallet custody

PowerChain never requests, stores, or logs private keys or seed phrases. Transaction authorization remains with the user's wallet.

## Secrets

Server-only examples include:

- Solana/RPC provider credentials
- Supabase service-role key
- Helius/Birdeye/CDP secrets
- webhook signing secrets
- quote/signing authority material

They must never be placed in `NEXT_PUBLIC_*`, `EXPO_PUBLIC_*`, frontend source, or mobile source.

## Runtime request protection

The backend includes:

- request IDs
- origin validation
- rate limiting
- typed errors
- audit events
- idempotency keys
- canonical request fingerprints
- atomic reservations
- mutation leases
- persistent receipts
- finality reconciliation

## Financial safety

A mutation must not be resubmitted only because an application process crashed or a lease expired. Reconciliation must inspect database state and known Solana transaction state first.

A submitted transaction is not complete until finality is established and the settlement reaches `reconciled`.

## Environment

Use `.env.example` only as a template. Keep `.env.local` and production secrets outside source control.

## Reporting

Do not put security reports containing credentials or sensitive production data into the repository.
