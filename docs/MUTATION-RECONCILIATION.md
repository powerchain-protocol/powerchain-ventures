# Mutation Reconciliation

A process crash can occur after an external chain transaction or database write but before the local receipt is finalized.

Before retrying settlement, recovery workers should reconcile:

1. mutation receipt
2. idempotency reservation
3. sale/claim database state
4. known Solana transaction signature
5. chain finality

Never re-submit a financial transaction solely because the process lease expired.
