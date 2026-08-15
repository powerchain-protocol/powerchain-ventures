# Mutation Receipts

A mutation receipt contains:

- mutation ID
- request ID
- mutation kind
- state
- HTTP status
- replay status
- timestamps
- optional result
- optional error code

Mutation IDs are derived from deterministic request fingerprints and are not wallet credentials or secrets.

Production status queries must read from the configured persistent receipt store.
