# Settlement Finality

Financial mutation success is separate from chain settlement finality.

Settlement states:

```text
created
→ submitted
→ observed
→ confirmed
→ finalized
→ reconciled
```

Terminal exception states:

```text
failed
manual-review
```

A purchase or claim must not be treated as fully settled solely because a transaction signature exists or because the RPC reports `processed`.

Production completion policy is `reconciled-after-finalized`.


## Runtime persistence bootstrap

Production uses:

```env
POWERCHAIN_RUNTIME_PERSISTENCE=database
```

`apps/backend/instrumentation.ts` bootstraps the Prisma 7 PostgreSQL adapter at Node runtime startup. Production fails closed if memory mode is requested, `DATABASE_URL` is missing, or runtime migrations are incomplete.

The schema preflight requires the runtime tables from migrations 028–035, including settlement/outbox state and outbox operator-diagnostic columns.

## Purchase completion boundary

A verified purchase is not presented as complete merely because the signature is processed or confirmed.

```text
wallet signature
  ↓
purchase transaction verified
  ↓
durable settlement = submitted
  ↓
settlement.observe outbox event
  ↓
confirmed
  ↓
finalized
  ↓
reconciled
  ↓
Checkout success receipt
```

`apps/checkout` waits for the settlement state `reconciled`.

A pending signed transaction is never automatically re-signed or resubmitted by recovery logic.

## Settlement worker

The worker endpoint is:

```text
GET|POST /api/v1/runtime/settlements/reconcile
```

It is protected by the reconciliation secret and is scheduled every minute by the backend Vercel configuration.

Each batch:

1. recovers expired outbox leases;
2. claims available events using `FOR UPDATE SKIP LOCKED`;
3. reads Solana signature status with transaction-history search enabled;
4. advances the settlement state monotonically;
5. retries bounded transient states;
6. marks exhausted work `manual-review`;
7. moves finalized settlements to `reconciled`.

Operator settings:

```env
SETTLEMENT_WORKER_BATCH_SIZE=50
SETTLEMENT_OUTBOX_FAILED_TOLERANCE=0
SETTLEMENT_OUTBOX_MAX_PENDING_AGE_MS=300000
```

Readiness becomes unhealthy when runtime persistence is unavailable, expired outbox leases exist, failed events exceed the configured tolerance, or the oldest pending event exceeds the configured age.

## Health

```text
GET /api/v1/runtime/persistence/health
GET /api/v1/ready
GET /api/v1/settlements/{settlementId}
```

Runtime persistence health includes settlement reachability and outbox backlog/failure/lease statistics.
