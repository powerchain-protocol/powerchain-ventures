# Release Provenance

Canonical public-data release metadata is stored in:

```text
packages/token-data/data/release-manifest.json
```

The manifest records release `1.0.0`, schema version, canonical artifact paths, and required release checks.

Validate with:

```bash
pnpm --filter @powerchain/token-data validate:release
```

This is repository provenance metadata, not a cryptographic deployment attestation. On-chain deployment verification remains a separate release requirement.
