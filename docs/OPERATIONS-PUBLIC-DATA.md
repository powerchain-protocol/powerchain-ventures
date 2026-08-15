# Public Data Operations

## Structured telemetry

Backend public-data telemetry is JSON-only and intentionally excludes keys whose names indicate credentials, authorization, cookies, tokens, passwords, or secrets.

Recommended events:

- `public_data_request`
- `public_data_success`
- `public_data_fallback`
- `public_data_validation_failure`
- `public_data_circuit_open`
- `public_data_health_failure`

## Response diagnostics

Public API helpers emit:

- `X-Request-ID`
- `X-PowerChain-Release`
- `X-PowerChain-Schema-Version`
- `X-Content-Type-Options: nosniff`
- appropriate `Vary`

These headers are operational metadata only and contain no private identifiers.

## Compatibility policy

Release `1.0.0` uses public-data schema version `1`. A breaking envelope or API contract change must not be introduced under the same schema/API version.
