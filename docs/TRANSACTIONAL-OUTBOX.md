# Transactional Outbox

Post-commit work uses a durable outbox.

Current event types include:

- `settlement.observe`
- `settlement.reconcile`
- `mutation.audit`
- `receipt.refresh`

Workers claim events with a lease using `FOR UPDATE SKIP LOCKED`, allowing safe concurrent workers.

Expired worker leases can be reclaimed. Completed/failed events are retained temporarily for operational inspection and later cleanup.
