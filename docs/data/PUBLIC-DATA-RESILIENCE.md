# Public Data Resilience

PowerChain public-data clients now use bounded retries and a small circuit breaker.

## Behavior

- maximum three attempts
- exponential retry delay, capped at 2 seconds
- network/schema failures increment circuit failures
- circuit opens after repeated failures
- after 30 seconds it permits a half-open probe
- canonical snapshot remains the display fallback
- fallback state is explicitly marked stale
- error codes remain machine-readable

## Content-addressed snapshots

Registry snapshot SHA-256:

`5c535800000ddcd895efb8b85705b6bdbd1abf726080def42b0b214677e6e4ed`

Integrity snapshot SHA-256:

`d1b7ca38252d5bf8a0533b158a9b688d0f5b26f7ceb4a65f4660d762d192963c`

The first 16 hex characters are embedded in immutable snapshot filenames.

These are public-data provenance aids only. They do not replace on-chain verification or backend settlement validation.
