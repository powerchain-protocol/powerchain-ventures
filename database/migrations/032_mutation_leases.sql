BEGIN;

CREATE TABLE IF NOT EXISTS powerchain_runtime_mutation_leases (
  mutation_id text PRIMARY KEY,
  owner_id text NOT NULL,
  state text NOT NULL CHECK (state IN ('active','expired','completed','failed')),
  lease_expires_at timestamptz NOT NULL,
  heartbeat_at timestamptz NOT NULL DEFAULT now(),
  attempt integer NOT NULL DEFAULT 1 CHECK (attempt >= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS powerchain_runtime_mutation_leases_expiry_idx
  ON powerchain_runtime_mutation_leases (lease_expires_at)
  WHERE state = 'active';

CREATE INDEX IF NOT EXISTS powerchain_runtime_mutation_leases_state_idx
  ON powerchain_runtime_mutation_leases (state, heartbeat_at DESC);

COMMIT;
