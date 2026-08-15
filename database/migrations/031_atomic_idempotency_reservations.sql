BEGIN;

CREATE TABLE IF NOT EXISTS powerchain_runtime_idempotency_reservations (
  idempotency_key text PRIMARY KEY,
  fingerprint text NOT NULL,
  state text NOT NULL CHECK (state IN ('reserved','completed','failed')),
  status_code integer CHECK (status_code IS NULL OR status_code BETWEEN 100 AND 599),
  response_body jsonb,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS powerchain_runtime_idempotency_reservations_expires_at_idx
  ON powerchain_runtime_idempotency_reservations (expires_at);

CREATE INDEX IF NOT EXISTS powerchain_runtime_idempotency_reservations_state_idx
  ON powerchain_runtime_idempotency_reservations (state, updated_at DESC);

COMMIT;
