# Security requirements

- Never accept private keys or seed phrases.
- Verify payment signatures, expected signer, treasury recipient, mint, token program, exact amounts and finality server-side.
- Persist idempotency keys before executing sale/claim settlement.
- Reject purchases outside the active sale phase and wallet limits.
- Use bigint/integer amounts; never JS floating point for settlement.
- Keep `SUPABASE_SERVICE_ROLE_KEY` and treasury/admin secrets server-only.
- Apply RLS to user-readable tables and privileged service access to settlement tables.
- Rate-limit quote, eligibility, purchase verification and claims independently.
- Treat RPC responses as untrusted and use bounded timeout/retry policies.

## Production readiness is fail-closed

`/api/v1/ready` returns HTTP 503 unless the server has a Solana RPC URL, a syntactically valid PowerChain treasury address, Supabase service configuration, a production transaction builder URL, and a reconciliation secret of at least 32 characters. This prevents an incomplete deployment from being advertised as healthy.

## Exact reviewed-transaction binding

A confirmed signature is not sufficient by itself. Every claim, purchase, sale activation, cancellation, and completion confirmation fetches the confirmed transaction with Solana `getTransaction` using base64 encoding and compares the byte-for-byte serialized transaction message against the message persisted in the prepared review. The signature section is intentionally excluded because wallet signing replaces placeholder signature bytes. State mutation is rejected if the confirmed message differs from the reviewed message. The verified SHA-256 message hash and RPC endpoint are persisted for audit/reconciliation.
