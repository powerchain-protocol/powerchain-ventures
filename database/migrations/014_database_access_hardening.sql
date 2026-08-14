-- PowerChain Launchpad 1.0.0 — Supabase/Postgres access boundary hardening.
-- Browser clients never write Launchpad tables directly; all mutations are server-owned.

do $$
declare t text;
begin
  foreach t in array array[
    'launchpad_sales','launchpad_wallets','launchpad_purchases','launchpad_claims',
    'launchpad_audit_log','launchpad_vesting','launchpad_idempotency',
    'launchpad_transaction_reviews','launchpad_rate_limits'
  ] loop
    execute format('alter table %I enable row level security',t);
    if exists(select 1 from pg_roles where rolname='anon') then execute format('revoke all on table %I from anon',t); end if;
    if exists(select 1 from pg_roles where rolname='authenticated') then execute format('revoke all on table %I from authenticated',t); end if;
    if exists(select 1 from pg_roles where rolname='service_role') then execute format('grant all on table %I to service_role',t); end if;
  end loop;
  if exists(select 1 from pg_roles where rolname='anon') then revoke all on sequence launchpad_audit_log_id_seq from anon; end if;
  if exists(select 1 from pg_roles where rolname='authenticated') then revoke all on sequence launchpad_audit_log_id_seq from authenticated; end if;
  if exists(select 1 from pg_roles where rolname='service_role') then grant usage,select on sequence launchpad_audit_log_id_seq to service_role; end if;
end $$;

revoke all on function launchpad_apply_confirmed_claim(uuid,text,numeric,text,text) from public;
revoke all on function launchpad_apply_confirmed_purchase(uuid,text,bigint,numeric,bigint,text,text,uuid,bigint) from public;
revoke all on function launchpad_expire_stale_reviews() from public;
revoke all on function launchpad_refresh_sale_phases(timestamptz) from public;
revoke all on function launchpad_apply_sale_action(uuid,text,text) from public;
revoke all on function launchpad_apply_sale_activation(uuid,text) from public;
revoke all on function launchpad_cleanup_stale_drafts(integer) from public;

-- Supabase service_role receives explicit execution rights when present.
do $$
begin
 if exists(select 1 from pg_roles where rolname='service_role') then
  grant execute on function launchpad_apply_confirmed_claim(uuid,text,numeric,text,text) to service_role;
  grant execute on function launchpad_apply_confirmed_purchase(uuid,text,bigint,numeric,bigint,text,text,uuid,bigint) to service_role;
  grant execute on function launchpad_expire_stale_reviews() to service_role;
  grant execute on function launchpad_refresh_sale_phases(timestamptz) to service_role;
  grant execute on function launchpad_apply_sale_action(uuid,text,text) to service_role;
  grant execute on function launchpad_apply_sale_activation(uuid,text) to service_role;
  grant execute on function launchpad_cleanup_stale_drafts(integer) to service_role;
 end if;
end $$;
