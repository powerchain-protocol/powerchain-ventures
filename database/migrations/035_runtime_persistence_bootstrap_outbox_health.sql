BEGIN;

ALTER TABLE IF EXISTS powerchain_runtime_outbox
  ADD COLUMN IF NOT EXISTS last_error text,
  ADD COLUMN IF NOT EXISTS last_error_at timestamptz,
  ADD COLUMN IF NOT EXISTS failed_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS powerchain_runtime_outbox_failed_idx
  ON powerchain_runtime_outbox (failed_at DESC)
  WHERE state = 'failed';

CREATE INDEX IF NOT EXISTS powerchain_runtime_outbox_lease_idx
  ON powerchain_runtime_outbox (lease_until)
  WHERE state = 'processing';

COMMIT;
