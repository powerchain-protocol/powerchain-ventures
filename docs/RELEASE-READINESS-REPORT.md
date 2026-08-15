# Release Readiness Report

Generate a machine-readable release report with:

```bash
pnpm release:readiness:report
```

Output:

```text
docs/reports/validation/release-readiness.json
```

The report records the exit status and bounded stdout/stderr for dependency, route, API contract, public-data, and snapshot checks.

It contains build diagnostics only and must not include secrets.
