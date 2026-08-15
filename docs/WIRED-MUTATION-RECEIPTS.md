# Wired Mutation Receipts

`GET /api/v1/mutations/{mutationId}` now reads from the configured runtime mutation receipt persistence.

Responses:

- `200` receipt found
- `400` invalid mutation ID
- `404` receipt not found

The earlier `503` placeholder has been removed.

Database-backed runtime configuration wires both the mutation receipt store and atomic idempotency reservation store during startup.
