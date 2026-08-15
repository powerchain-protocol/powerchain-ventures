# Security Policy

The shared security policy defines:

- same-origin public API posture
- no credential-bearing public metadata requests
- `nosniff`
- strict referrer policy
- frame denial
- restrictive permissions policy
- conservative rate-limit metadata

Rate-limit values are policy metadata. The concrete distributed limiter can be backed by the existing production persistence/cache layer without changing the public API contract.
