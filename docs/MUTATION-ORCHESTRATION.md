# Mutation Orchestration

The runtime now provides a common orchestration layer for financial and creator mutations.

## Supported mutation classes

- purchase
- claim
- creator create sale
- creator update sale
- creator complete sale
- creator cancel sale

Each mutation gets deterministic request fingerprinting, persistent idempotency, a mutation receipt, replay metadata, and a stable request ID.

## Domain validation

Purchase amounts use canonical base-unit integer strings. Floating-point settlement amounts are not accepted by the mutation input contract.

## Receipts

Migration `030_runtime_mutation_receipts.sql` stores durable mutation receipts.

The status route is intentionally fail-closed until the application startup layer injects the configured persistent receipt store. It returns `503` rather than fabricating status.
