BEGIN;

CREATE TABLE IF NOT EXISTS powerchain_runtime_settlements (
  settlement_id text PRIMARY KEY,
  mutation_id text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('purchase','claim','creator')),
  state text NOT NULL CHECK (
    state IN ('created','submitted','observed','confirmed','finalized','reconciled','failed','manual-review')
  ),
  transaction_signature text,
  submitted_at timestamptz,
  observed_at timestamptz,
  finalized_at timestamptz,
  reconciled_at timestamptz,
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS powerchain_runtime_settlements_state_idx
  ON powerchain_runtime_settlements (state, updated_at DESC);

CREATE INDEX IF NOT EXISTS powerchain_runtime_settlements_signature_idx
  ON powerchain_runtime_settlements (transaction_signature)
  WHERE transaction_signature IS NOT NULL;

CREATE TABLE IF NOT EXISTS powerchain_runtime_outbox (
  event_id text PRIMARY KEY,
  type text NOT NULL,
  aggregate_id text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','processing','completed','failed')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  available_at timestamptz NOT NULL DEFAULT now(),
  owner_id text,
  lease_until timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS powerchain_runtime_outbox_pending_idx
  ON powerchain_runtime_outbox (available_at, created_at)
  WHERE state IN ('pending','processing');

CREATE INDEX IF NOT EXISTS powerchain_runtime_outbox_aggregate_idx
  ON powerchain_runtime_outbox (aggregate_id);

COMMIT;
