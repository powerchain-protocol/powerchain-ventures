# Mutation Crash Recovery

Recovery decisions distinguish:

- active processing lease → no action
- expired processing lease → takeover
- exceeded recovery attempts → mark failed
- processing receipt with persisted result → reconcile
- completed mutation → no action

Inspection endpoint:

```text
GET /api/v1/runtime/mutations/{mutationId}/recovery
```

This endpoint reports recovery state; it does not itself perform financial settlement.

Chain/database reconciliation remains authoritative before retrying a purchase or claim whose external transaction may already have been submitted.
