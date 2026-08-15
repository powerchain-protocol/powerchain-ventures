BEGIN;

CREATE TABLE IF NOT EXISTS powerchain_runtime_mutation_receipts (
  mutation_id text PRIMARY KEY,
  request_id text NOT NULL,
  kind text NOT NULL,
  state text NOT NULL CHECK (state IN ('accepted','processing','succeeded','failed','replayed')),
  status_code integer NOT NULL CHECK (status_code BETWEEN 100 AND 599),
  replayed boolean NOT NULL DEFAULT false,
  result jsonb,
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS powerchain_runtime_mutation_receipts_request_id_idx
  ON powerchain_runtime_mutation_receipts (request_id);

CREATE INDEX IF NOT EXISTS powerchain_runtime_mutation_receipts_state_idx
  ON powerchain_runtime_mutation_receipts (state, updated_at DESC);

COMMIT;
