BEGIN;

CREATE OR REPLACE FUNCTION powerchain_cleanup_runtime_protection()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM powerchain_runtime_rate_limits
  WHERE reset_at < now() - interval '10 minutes';

  DELETE FROM powerchain_runtime_idempotency
  WHERE expires_at < now();

  DELETE FROM powerchain_runtime_idempotency_reservations
  WHERE expires_at < now();

  DELETE FROM powerchain_runtime_audit
  WHERE occurred_at < now() - interval '90 days';

  DELETE FROM powerchain_runtime_mutation_leases
  WHERE state IN ('completed','failed')
    AND heartbeat_at < now() - interval '7 days';

  DELETE FROM powerchain_runtime_outbox
  WHERE state IN ('completed','failed')
    AND created_at < now() - interval '30 days';
END;
$$;

REVOKE ALL ON FUNCTION powerchain_cleanup_runtime_protection() FROM PUBLIC;

COMMIT;
