# Solana Finality Reconciliation

The observer uses `getSignatureStatuses` with transaction-history lookup enabled.

Observed states are normalized to:

- not-found
- processed
- confirmed
- finalized
- failed

The reconciliation worker is bounded by both attempt count and wall-clock age.

Current defaults:

- 5 second polling interval
- maximum 120 attempts
- maximum age 15 minutes

Exhausted reconciliation moves the settlement to `manual-review` instead of endlessly retrying or blindly resubmitting a transaction.
