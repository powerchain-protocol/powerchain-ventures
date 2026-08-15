BEGIN;

CREATE TABLE IF NOT EXISTS powerchain_runtime_rate_limits (
  bucket text NOT NULL,
  identity_hash text NOT NULL,
  count integer NOT NULL DEFAULT 0 CHECK (count >= 0),
  reset_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (bucket, identity_hash)
);

CREATE INDEX IF NOT EXISTS powerchain_runtime_rate_limits_reset_at_idx
  ON powerchain_runtime_rate_limits (reset_at);

CREATE TABLE IF NOT EXISTS powerchain_runtime_idempotency (
  idempotency_key text PRIMARY KEY,
  fingerprint text NOT NULL,
  status_code integer NOT NULL CHECK (status_code BETWEEN 100 AND 599),
  response_body jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS powerchain_runtime_idempotency_expires_at_idx
  ON powerchain_runtime_idempotency (expires_at);

CREATE TABLE IF NOT EXISTS powerchain_runtime_audit (
  id bigserial PRIMARY KEY,
  event text NOT NULL,
  request_id text,
  route text,
  status integer,
  code text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS powerchain_runtime_audit_occurred_at_idx
  ON powerchain_runtime_audit (occurred_at DESC);

CREATE INDEX IF NOT EXISTS powerchain_runtime_audit_request_id_idx
  ON powerchain_runtime_audit (request_id)
  WHERE request_id IS NOT NULL;

COMMIT;
