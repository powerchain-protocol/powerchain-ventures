-- ===== 001_launchpad.sql =====
create table if not exists launchpad_sales (
 id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, mint text not null,
 phase text not null check (phase in ('draft','scheduled','private','public','ended','claimable','completed','cancelled')),
 starts_at timestamptz not null, ends_at timestamptz not null, claim_starts_at timestamptz not null,
 price_usd_micros bigint not null check (price_usd_micros>0), allocation_base_units numeric(30,0) not null check (allocation_base_units>0),
 service_fee_bps int not null default 250 check(service_fee_bps between 0 and 10000), created_at timestamptz not null default now()
);
create table if not exists launchpad_wallets (sale_id uuid references launchpad_sales(id) on delete cascade, wallet text not null, kind text not null check(kind in('trusted','allowlist')), primary key(sale_id,wallet,kind));
create table if not exists launchpad_purchases (id uuid primary key default gen_random_uuid(), sale_id uuid references launchpad_sales(id), wallet text not null, idempotency_key text unique not null, usd_micros bigint not null, token_base_units numeric(30,0) not null, fee_usd_micros bigint not null, signature text unique, status text not null, created_at timestamptz not null default now());
create table if not exists launchpad_claims (id uuid primary key default gen_random_uuid(), sale_id uuid references launchpad_sales(id), wallet text not null, amount_base_units numeric(30,0) not null, signature text unique, idempotency_key text unique not null, created_at timestamptz not null default now());
create table if not exists launchpad_audit_log (id bigserial primary key, actor text, action text not null, entity_type text not null, entity_id text, payload jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());

-- ===== 002_production_hardening.sql =====
-- PowerChain Launchpad 1.0.0 production hardening
alter table launchpad_sales add column if not exists eligibility_mode text not null default 'public' check (eligibility_mode in ('public','allowlist','trusted'));
alter table launchpad_sales add column if not exists min_purchase_usd_micros bigint not null default 1 check (min_purchase_usd_micros > 0);
alter table launchpad_sales add column if not exists max_purchase_usd_micros bigint not null default 9223372036854775807 check (max_purchase_usd_micros > 0);
alter table launchpad_sales add column if not exists sold_base_units numeric(30,0) not null default 0 check (sold_base_units >= 0);
alter table launchpad_sales add column if not exists updated_at timestamptz not null default now();
create index if not exists launchpad_sales_phase_idx on launchpad_sales(phase,starts_at,ends_at);
create index if not exists launchpad_purchases_sale_wallet_idx on launchpad_purchases(sale_id,wallet,created_at desc);
create index if not exists launchpad_claims_sale_wallet_idx on launchpad_claims(sale_id,wallet,created_at desc);
create unique index if not exists launchpad_purchases_signature_unique on launchpad_purchases(signature) where signature is not null;
create unique index if not exists launchpad_claims_signature_unique on launchpad_claims(signature) where signature is not null;
create table if not exists launchpad_vesting (
 id uuid primary key default gen_random_uuid(), sale_id uuid not null references launchpad_sales(id) on delete cascade,
 wallet text not null, total_base_units numeric(30,0) not null check(total_base_units>0), claimed_base_units numeric(30,0) not null default 0 check(claimed_base_units>=0),
 cliff_at timestamptz, starts_at timestamptz not null, ends_at timestamptz not null,
 created_at timestamptz not null default now(), unique(sale_id,wallet), check(starts_at<=ends_at), check(claimed_base_units<=total_base_units)
);
create table if not exists launchpad_idempotency (
 scope text not null, key text not null, request_hash text not null, response_status int, response_body jsonb,
 expires_at timestamptz not null, created_at timestamptz not null default now(), primary key(scope,key)
);

-- ===== 003_creator_claim_review.sql =====
-- PowerChain Launchpad 1.0.0: creator, claim and transaction review support
alter table launchpad_sales add column if not exists symbol text not null default 'PWRC';
alter table launchpad_sales add column if not exists decimals int not null default 9 check (decimals between 0 and 18);
alter table launchpad_sales add column if not exists creator_wallet text;
alter table launchpad_sales add column if not exists vesting_enabled boolean not null default false;
alter table launchpad_sales add column if not exists vesting_cliff_days int not null default 0 check (vesting_cliff_days >= 0);
alter table launchpad_sales add column if not exists vesting_duration_days int not null default 0 check (vesting_duration_days >= 0);
create index if not exists launchpad_vesting_wallet_idx on launchpad_vesting(wallet, created_at desc);
create table if not exists launchpad_transaction_reviews (
 id uuid primary key default gen_random_uuid(),
 wallet text not null,
 kind text not null check(kind in ('claim','sale-activation','purchase')),
 sale_id uuid references launchpad_sales(id) on delete cascade,
 plan_hash text not null,
 expires_at timestamptz,
 submitted_signature text unique,
 status text not null default 'prepared' check(status in ('prepared','submitted','confirmed','failed','expired')),
 created_at timestamptz not null default now()
);
create index if not exists launchpad_transaction_reviews_wallet_idx on launchpad_transaction_reviews(wallet,created_at desc);

-- ===== 004_transaction_confirmation.sql =====
-- PowerChain Launchpad 1.0.0: bind prepared transaction reviews to confirmed effects
alter table launchpad_transaction_reviews add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table launchpad_transaction_reviews add column if not exists confirmed_slot bigint;
create unique index if not exists launchpad_transaction_review_id_wallet on launchpad_transaction_reviews(id,wallet);

-- ===== 005_transaction_integrity_atomic_claims.sql =====
-- PowerChain Launchpad 1.0.0: immutable review payloads + atomic claim application
alter table launchpad_transaction_reviews add column if not exists plan jsonb;
create index if not exists launchpad_transaction_reviews_expiry_idx on launchpad_transaction_reviews(status, expires_at) where status in ('prepared','submitted');
create unique index if not exists launchpad_one_live_claim_review
  on launchpad_transaction_reviews(sale_id,wallet)
  where kind='claim' and status in ('prepared','submitted');

create or replace function launchpad_apply_confirmed_claim(
  p_sale_id uuid,
  p_wallet text,
  p_amount numeric,
  p_signature text,
  p_idempotency_key text
) returns numeric
language plpgsql
as $$
declare
  current_claimed numeric;
  total_alloc numeric;
begin
  if p_amount <= 0 then raise exception 'invalid_claim_amount'; end if;
  select claimed_base_units,total_base_units into current_claimed,total_alloc
    from launchpad_vesting where sale_id=p_sale_id and wallet=p_wallet for update;
  if not found then raise exception 'vesting_not_found'; end if;
  if current_claimed + p_amount > total_alloc then raise exception 'claim_exceeds_allocation'; end if;

  insert into launchpad_claims(sale_id,wallet,amount_base_units,signature,idempotency_key)
    values(p_sale_id,p_wallet,p_amount,p_signature,p_idempotency_key)
    on conflict(idempotency_key) do nothing;

  if found then
    update launchpad_vesting set claimed_base_units=current_claimed+p_amount
      where sale_id=p_sale_id and wallet=p_wallet;
    return current_claimed+p_amount;
  end if;
  return current_claimed;
end;
$$;

-- ===== 006_purchase_settlement_reconciliation.sql =====
-- PowerChain Launchpad 1.0.0: atomic purchase settlement + reconciliation
alter table launchpad_purchases add column if not exists confirmed_slot bigint;
alter table launchpad_purchases add column if not exists updated_at timestamptz not null default now();
alter table launchpad_purchases add column if not exists review_id uuid references launchpad_transaction_reviews(id);
alter table launchpad_purchases add column if not exists expires_at timestamptz;

create index if not exists launchpad_purchases_status_idx on launchpad_purchases(status, created_at);
create unique index if not exists launchpad_purchase_review_unique on launchpad_purchases(review_id) where review_id is not null;
create unique index if not exists launchpad_one_live_purchase_review
  on launchpad_transaction_reviews(sale_id,wallet)
  where kind='purchase' and status in ('prepared','submitted');

create or replace function launchpad_apply_confirmed_purchase(
  p_sale_id uuid,
  p_wallet text,
  p_usd_micros bigint,
  p_token_base_units numeric,
  p_fee_usd_micros bigint,
  p_signature text,
  p_idempotency_key text,
  p_review_id uuid,
  p_confirmed_slot bigint
) returns jsonb
language plpgsql
as $$
declare
  s launchpad_sales%rowtype;
  wallet_spent bigint;
  purchase_id uuid;
  inserted_purchase boolean := false;
  expected_tokens numeric;
  expected_fee bigint;
  eligible boolean;
begin
  if p_usd_micros <= 0 or p_token_base_units <= 0 or p_fee_usd_micros < 0 then
    raise exception 'invalid_purchase_amount';
  end if;

  select * into s from launchpad_sales where id=p_sale_id for update;
  if not found then raise exception 'sale_not_found'; end if;
  if s.phase not in ('private','public') then raise exception 'sale_not_open'; end if;
  if now() < s.starts_at or now() >= s.ends_at then raise exception 'sale_not_in_active_window'; end if;
  if s.sold_base_units + p_token_base_units > s.allocation_base_units then raise exception 'sale_allocation_exceeded'; end if;
  if p_usd_micros < s.min_purchase_usd_micros then raise exception 'purchase_below_minimum'; end if;

  expected_tokens := trunc((p_usd_micros::numeric * power(10::numeric,s.decimals)) / s.price_usd_micros::numeric);
  expected_fee := ceil((p_usd_micros::numeric * s.service_fee_bps::numeric) / 10000::numeric)::bigint;
  if expected_tokens <> p_token_base_units then raise exception 'purchase_token_amount_mismatch'; end if;
  if expected_fee <> p_fee_usd_micros then raise exception 'purchase_service_fee_mismatch'; end if;

  if s.eligibility_mode <> 'public' then
    select exists(select 1 from launchpad_wallets where sale_id=p_sale_id and wallet=p_wallet and kind=s.eligibility_mode) into eligible;
    if not eligible then raise exception 'wallet_not_eligible'; end if;
  end if;

  select coalesce(sum(usd_micros),0)::bigint into wallet_spent
    from launchpad_purchases
    where sale_id=p_sale_id and wallet=p_wallet and status='confirmed';
  if wallet_spent + p_usd_micros > s.max_purchase_usd_micros then raise exception 'wallet_purchase_limit_exceeded'; end if;

  insert into launchpad_purchases(
    sale_id,wallet,idempotency_key,usd_micros,token_base_units,fee_usd_micros,
    signature,status,review_id,confirmed_slot,updated_at
  ) values(
    p_sale_id,p_wallet,p_idempotency_key,p_usd_micros,p_token_base_units,p_fee_usd_micros,
    p_signature,'confirmed',p_review_id,p_confirmed_slot,now()
  )
  on conflict(idempotency_key) do nothing
  returning id into purchase_id;

  if purchase_id is not null then
    inserted_purchase := true;
    update launchpad_sales
      set sold_base_units=sold_base_units+p_token_base_units, updated_at=now()
      where id=p_sale_id;
  else
    select id into purchase_id from launchpad_purchases where idempotency_key=p_idempotency_key;
  end if;

  return jsonb_build_object(
    'purchaseId', purchase_id,
    'soldBaseUnits', (select sold_base_units from launchpad_sales where id=p_sale_id),
    'walletSpentUsdMicros', wallet_spent + case when inserted_purchase then p_usd_micros else 0 end
  );
end;
$$;

create or replace function launchpad_expire_stale_reviews() returns integer
language plpgsql
as $$
declare affected integer;
begin
  update launchpad_transaction_reviews
    set status='expired'
    where status in ('prepared','submitted') and expires_at is not null and expires_at <= now();
  get diagnostics affected = row_count;
  return affected;
end;
$$;

-- ===== 007_operational_hardening.sql =====
-- PowerChain Launchpad 1.0.0: operational hardening
-- Safe indexes for confirmation lookup, creator dashboards, reconciliation, and audit review.
create index if not exists launchpad_reviews_signature_idx
  on launchpad_transaction_reviews(submitted_signature)
  where submitted_signature is not null;
create index if not exists launchpad_reviews_sale_status_idx
  on launchpad_transaction_reviews(sale_id,status,created_at desc);
create index if not exists launchpad_sales_creator_created_idx
  on launchpad_sales(creator_wallet,created_at desc);
create index if not exists launchpad_claims_wallet_sale_idx
  on launchpad_claims(wallet,sale_id,created_at desc);
create index if not exists launchpad_purchases_wallet_sale_idx
  on launchpad_purchases(wallet,sale_id,created_at desc);
create index if not exists launchpad_audit_entity_idx
  on launchpad_audit_log(entity_type,entity_id,created_at desc);
create index if not exists launchpad_audit_actor_idx
  on launchpad_audit_log(actor,created_at desc)
  where actor is not null;

-- ===== 008_sale_phase_creator_dashboard.sql =====
-- PowerChain Launchpad 1.0.0: deterministic sale phase reconciliation + creator dashboard indexes.
create or replace function launchpad_refresh_sale_phases(p_now timestamptz default now())
returns table(updated_count bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  n bigint := 0;
begin
  -- Never alter draft/cancelled/completed phases. Only advance activated lifecycle states.
  update launchpad_sales
     set phase = case
       when p_now >= claim_starts_at then 'claimable'
       when p_now >= ends_at then 'ended'
       when p_now >= starts_at then case when eligibility_mode = 'public' then 'public' else 'private' end
       else 'scheduled'
     end
   where phase in ('scheduled','private','public','ended','claimable')
     and phase is distinct from case
       when p_now >= claim_starts_at then 'claimable'
       when p_now >= ends_at then 'ended'
       when p_now >= starts_at then case when eligibility_mode = 'public' then 'public' else 'private' end
       else 'scheduled'
     end;
  get diagnostics n = row_count;
  return query select n;
end;
$$;

create index if not exists launchpad_sales_creator_created_idx
  on launchpad_sales (creator_wallet, created_at desc);
create index if not exists launchpad_purchases_sale_status_idx
  on launchpad_purchases (sale_id, status, created_at desc);
create index if not exists launchpad_claims_sale_created_idx
  on launchpad_claims (sale_id, created_at desc);

-- ===== 009_signed_creator_lifecycle_actions.sql =====
-- PowerChain Launchpad 1.0.0: signed creator lifecycle actions.
alter table launchpad_sales add column if not exists cancelled_at timestamptz;
alter table launchpad_sales add column if not exists completed_at timestamptz;

create or replace function launchpad_apply_sale_action(
  p_sale_id uuid,
  p_creator_wallet text,
  p_action text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_phase text;
  owner_wallet text;
  confirmed_purchases bigint := 0;
  purchased_tokens numeric := 0;
  claimed_tokens numeric := 0;
begin
  if p_action not in ('cancel','complete') then raise exception 'invalid_sale_action'; end if;

  select phase, creator_wallet into current_phase, owner_wallet
    from launchpad_sales where id=p_sale_id for update;
  if not found then raise exception 'sale_not_found'; end if;
  if owner_wallet <> p_creator_wallet then raise exception 'creator_mismatch'; end if;

  if p_action='cancel' then
    if current_phase='cancelled' then return 'cancelled'; end if;
    if current_phase='completed' then raise exception 'completed_sale_cannot_cancel'; end if;
    select count(*) into confirmed_purchases from launchpad_purchases
      where sale_id=p_sale_id and status='confirmed';
    if confirmed_purchases > 0 then raise exception 'sale_has_confirmed_purchases'; end if;
    update launchpad_sales set phase='cancelled', cancelled_at=coalesce(cancelled_at,now()) where id=p_sale_id;
    return 'cancelled';
  end if;

  if current_phase='completed' then return 'completed'; end if;
  if current_phase='cancelled' then raise exception 'cancelled_sale_cannot_complete'; end if;
  if current_phase not in ('ended','claimable') then raise exception 'sale_not_ready_to_complete'; end if;

  select coalesce(sum(token_base_units),0) into purchased_tokens
    from launchpad_purchases where sale_id=p_sale_id and status='confirmed';
  select coalesce(sum(amount_base_units),0) into claimed_tokens
    from launchpad_claims where sale_id=p_sale_id;
  if claimed_tokens < purchased_tokens then raise exception 'unclaimed_tokens_remain'; end if;

  update launchpad_sales set phase='completed', completed_at=coalesce(completed_at,now()) where id=p_sale_id;
  return 'completed';
end;
$$;

create unique index if not exists launchpad_one_live_sale_action_review
  on launchpad_transaction_reviews(sale_id,wallet,kind)
  where kind in ('sale-cancel','sale-complete') and status in ('prepared','submitted');

create index if not exists launchpad_sales_phase_creator_idx
  on launchpad_sales(creator_wallet,phase,created_at desc);

-- ===== 010_transaction_message_binding.sql =====
-- PowerChain Launchpad 1.0.0: bind confirmed signatures to the exact reviewed Solana message.
alter table launchpad_transaction_reviews add column if not exists confirmed_message_hash text;
alter table launchpad_transaction_reviews add column if not exists confirmed_rpc_endpoint text;
alter table launchpad_transaction_reviews add column if not exists confirmed_at timestamptz;

create index if not exists launchpad_reviews_confirmed_message_hash_idx
  on launchpad_transaction_reviews(confirmed_message_hash)
  where confirmed_message_hash is not null;

create index if not exists launchpad_reviews_confirmation_audit_idx
  on launchpad_transaction_reviews(status,confirmed_at desc)
  where status='confirmed';

comment on column launchpad_transaction_reviews.confirmed_message_hash is
  'SHA-256 of the exact serialized Solana transaction message verified against getTransaction after wallet submission.';

-- ===== 011_distributed_rate_limits_and_runtime_guards.sql =====
-- PowerChain Launchpad 1.0.0: distributed abuse controls and runtime integrity guards.
create table if not exists launchpad_rate_limits (
  scope text not null,
  subject_hash text not null,
  bucket_start timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (scope, subject_hash, bucket_start)
);

create or replace function launchpad_consume_rate_limit(
  p_scope text,
  p_subject_hash text,
  p_limit integer,
  p_window_seconds integer default 60
) returns table(allowed boolean, remaining integer, reset_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_bucket timestamptz;
  v_count integer;
begin
  if p_limit < 1 or p_limit > 10000 then raise exception 'invalid_rate_limit'; end if;
  if p_window_seconds < 1 or p_window_seconds > 3600 then raise exception 'invalid_rate_window'; end if;
  if p_scope is null or length(p_scope) < 1 or length(p_scope) > 80 then raise exception 'invalid_rate_scope'; end if;
  if p_subject_hash !~ '^[a-f0-9]{64}$' then raise exception 'invalid_rate_subject'; end if;

  v_bucket := to_timestamp(floor(extract(epoch from v_now) / p_window_seconds) * p_window_seconds);
  insert into launchpad_rate_limits(scope, subject_hash, bucket_start, request_count, updated_at)
  values (p_scope, p_subject_hash, v_bucket, 1, v_now)
  on conflict (scope, subject_hash, bucket_start)
  do update set request_count = launchpad_rate_limits.request_count + 1, updated_at = excluded.updated_at
  returning request_count into v_count;

  allowed := v_count <= p_limit;
  remaining := greatest(p_limit - v_count, 0);
  reset_at := v_bucket + make_interval(secs => p_window_seconds);
  return next;
end $$;

revoke all on function launchpad_consume_rate_limit(text,text,integer,integer) from public;
grant execute on function launchpad_consume_rate_limit(text,text,integer,integer) to service_role;

create index if not exists launchpad_rate_limits_cleanup_idx on launchpad_rate_limits(bucket_start);

-- Reviews must carry valid immutable digests when present.
alter table launchpad_transaction_reviews
  drop constraint if exists launchpad_transaction_reviews_plan_hash_format;
alter table launchpad_transaction_reviews
  add constraint launchpad_transaction_reviews_plan_hash_format
  check (plan_hash is null or plan_hash ~ '^[a-f0-9]{64}$') not valid;
alter table launchpad_transaction_reviews validate constraint launchpad_transaction_reviews_plan_hash_format;

-- PowerChain service fee is fixed at 2.5% for this 1.0.0 product release.
alter table launchpad_sales
  drop constraint if exists launchpad_sales_powerchain_fee;
alter table launchpad_sales
  add constraint launchpad_sales_powerchain_fee check (service_fee_bps = 250) not valid;
alter table launchpad_sales validate constraint launchpad_sales_powerchain_fee;

-- Reconciliation cleanup for old limiter buckets.
create or replace function launchpad_cleanup_rate_limits(p_older_than_seconds integer default 7200)
returns integer language plpgsql security definer set search_path=public as $$
declare v_count integer;
begin
  if p_older_than_seconds < 300 then raise exception 'cleanup_window_too_small'; end if;
  delete from launchpad_rate_limits where bucket_start < clock_timestamp() - make_interval(secs => p_older_than_seconds);
  get diagnostics v_count = row_count;
  return v_count;
end $$;
revoke all on function launchpad_cleanup_rate_limits(integer) from public;
grant execute on function launchpad_cleanup_rate_limits(integer) to service_role;

-- ===== 012_fullstack_catalog_runtime.sql =====
-- PowerChain Launchpad 1.0.0 — public catalog/runtime indexes
create index if not exists launchpad_sales_catalog_idx
  on launchpad_sales(phase,starts_at,ends_at)
  where phase in ('scheduled','private','public','ended','claimable','completed');
create index if not exists launchpad_purchases_catalog_metrics_idx
  on launchpad_purchases(sale_id,status,wallet);
create index if not exists launchpad_reviews_pending_reconcile_idx
  on launchpad_transaction_reviews(status,expires_at)
  where status in ('prepared','submitted');

-- ===== 013_activation_and_draft_hardening.sql =====
-- PowerChain Launchpad 1.0.0 — signed activation and stale-draft hardening.
alter table launchpad_sales add column if not exists draft_expires_at timestamptz;
update launchpad_sales set draft_expires_at=coalesce(draft_expires_at,created_at+interval '24 hours') where phase='draft';

create or replace function launchpad_apply_sale_activation(
  p_sale_id uuid,
  p_creator_wallet text
) returns text
language plpgsql
security definer
set search_path=public
as $$
declare
  s launchpad_sales%rowtype;
  next_phase text;
begin
  select * into s from launchpad_sales where id=p_sale_id for update;
  if not found then raise exception 'sale_not_found'; end if;
  if s.creator_wallet is null or s.creator_wallet<>p_creator_wallet then raise exception 'creator_mismatch'; end if;
  if s.phase in ('scheduled','private','public','ended','claimable','completed') then return s.phase; end if;
  if s.phase='cancelled' then raise exception 'cancelled_sale_cannot_activate'; end if;
  if s.phase<>'draft' then raise exception 'invalid_activation_phase'; end if;
  if clock_timestamp()>=s.ends_at then raise exception 'sale_already_ended'; end if;
  if clock_timestamp()<s.starts_at then next_phase:='scheduled';
  elsif s.eligibility_mode='public' then next_phase:='public';
  else next_phase:='private';
  end if;
  update launchpad_sales set phase=next_phase,draft_expires_at=null,updated_at=clock_timestamp() where id=p_sale_id;
  return next_phase;
end;
$$;
revoke all on function launchpad_apply_sale_activation(uuid,text) from public;
grant execute on function launchpad_apply_sale_activation(uuid,text) to service_role;

create or replace function launchpad_cleanup_stale_drafts(p_older_than_seconds integer default 86400)
returns integer
language plpgsql
security definer
set search_path=public
as $$
declare v_count integer;
begin
  if p_older_than_seconds<3600 then raise exception 'draft_cleanup_window_too_small'; end if;
  delete from launchpad_sales s
   where s.phase='draft'
     and coalesce(s.draft_expires_at,s.created_at+make_interval(secs=>p_older_than_seconds))<clock_timestamp()
     and not exists (
       select 1 from launchpad_transaction_reviews r
       where r.sale_id=s.id and r.kind='sale-activation' and r.status='confirmed'
     );
  get diagnostics v_count=row_count;
  return v_count;
end;
$$;
revoke all on function launchpad_cleanup_stale_drafts(integer) from public;
grant execute on function launchpad_cleanup_stale_drafts(integer) to service_role;

create index if not exists launchpad_sales_stale_draft_idx on launchpad_sales(draft_expires_at) where phase='draft';

-- ===== 014_database_access_hardening.sql =====
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

-- ===== 015_presale_delivery_and_vesting_entitlements.sql =====
-- PowerChain Launchpad 1.0.0 — presale delivery, wallet routing and vesting entitlements.
alter table launchpad_sales add column if not exists source_vault_token_account text;
alter table launchpad_sales add column if not exists payment_receiver_wallet text;
alter table launchpad_sales add column if not exists delivery_mode text not null default 'claim' check (delivery_mode in ('immediate','claim'));

alter table launchpad_purchases add column if not exists buyer_token_account text;
alter table launchpad_purchases add column if not exists delivered_base_units numeric(30,0) not null default 0 check (delivered_base_units>=0);
alter table launchpad_purchases add column if not exists delivery_verified_at timestamptz;
alter table launchpad_claims add column if not exists buyer_token_account text;
alter table launchpad_claims add column if not exists delivery_verified_at timestamptz;

create index if not exists launchpad_purchases_delivery_idx on launchpad_purchases(sale_id,wallet,delivery_verified_at);
create index if not exists launchpad_claims_delivery_idx on launchpad_claims(sale_id,wallet,delivery_verified_at);

create or replace function launchpad_apply_confirmed_purchase(
  p_sale_id uuid,
  p_wallet text,
  p_usd_micros bigint,
  p_token_base_units numeric,
  p_fee_usd_micros bigint,
  p_signature text,
  p_idempotency_key text,
  p_review_id uuid,
  p_confirmed_slot bigint
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  s launchpad_sales%rowtype;
  wallet_spent bigint;
  purchase_id uuid;
  inserted_purchase boolean := false;
  expected_tokens numeric;
  expected_fee bigint;
  eligible boolean;
  vest_start timestamptz;
  vest_cliff timestamptz;
  vest_end timestamptz;
begin
  if p_usd_micros <= 0 or p_token_base_units <= 0 or p_fee_usd_micros < 0 then raise exception 'invalid_purchase_amount'; end if;
  select * into s from launchpad_sales where id=p_sale_id for update;
  if not found then raise exception 'sale_not_found'; end if;
  if s.phase not in ('private','public') then raise exception 'sale_not_open'; end if;
  if now() < s.starts_at or now() >= s.ends_at then raise exception 'sale_not_in_active_window'; end if;
  if s.sold_base_units + p_token_base_units > s.allocation_base_units then raise exception 'sale_allocation_exceeded'; end if;
  if p_usd_micros < s.min_purchase_usd_micros then raise exception 'purchase_below_minimum'; end if;

  expected_tokens := trunc((p_usd_micros::numeric * power(10::numeric,s.decimals)) / s.price_usd_micros::numeric);
  expected_fee := ceil((p_usd_micros::numeric * s.service_fee_bps::numeric) / 10000::numeric)::bigint;
  if expected_tokens <> p_token_base_units then raise exception 'purchase_token_amount_mismatch'; end if;
  if expected_fee <> p_fee_usd_micros then raise exception 'purchase_service_fee_mismatch'; end if;

  if s.eligibility_mode <> 'public' then
    select exists(select 1 from launchpad_wallets where sale_id=p_sale_id and wallet=p_wallet and kind=s.eligibility_mode) into eligible;
    if not eligible then raise exception 'wallet_not_eligible'; end if;
  end if;

  select coalesce(sum(usd_micros),0)::bigint into wallet_spent from launchpad_purchases where sale_id=p_sale_id and wallet=p_wallet and status='confirmed';
  if wallet_spent + p_usd_micros > s.max_purchase_usd_micros then raise exception 'wallet_purchase_limit_exceeded'; end if;

  insert into launchpad_purchases(sale_id,wallet,idempotency_key,usd_micros,token_base_units,fee_usd_micros,signature,status,review_id,confirmed_slot,updated_at)
  values(p_sale_id,p_wallet,p_idempotency_key,p_usd_micros,p_token_base_units,p_fee_usd_micros,p_signature,'confirmed',p_review_id,p_confirmed_slot,now())
  on conflict(idempotency_key) do nothing returning id into purchase_id;

  if purchase_id is not null then
    inserted_purchase := true;
    update launchpad_sales set sold_base_units=sold_base_units+p_token_base_units,updated_at=now() where id=p_sale_id;

    -- Vesting entitlement is created from the confirmed purchase itself. No browser input can mint entitlement.
    if s.delivery_mode='claim' or s.vesting_enabled then
      vest_start := s.claim_starts_at;
      vest_cliff := s.claim_starts_at + make_interval(days=>s.vesting_cliff_days);
      vest_end := case when s.vesting_duration_days>0 then s.claim_starts_at + make_interval(days=>s.vesting_duration_days) else s.claim_starts_at end;
      insert into launchpad_vesting(sale_id,wallet,total_base_units,claimed_base_units,starts_at,cliff_at,ends_at)
      values(p_sale_id,p_wallet,p_token_base_units,0,vest_start,vest_cliff,vest_end)
      on conflict(sale_id,wallet) do update set total_base_units=launchpad_vesting.total_base_units+excluded.total_base_units;
    end if;
  else
    select id into purchase_id from launchpad_purchases where idempotency_key=p_idempotency_key;
  end if;

  return jsonb_build_object(
    'purchaseId',purchase_id,
    'soldBaseUnits',(select sold_base_units from launchpad_sales where id=p_sale_id),
    'walletSpentUsdMicros',wallet_spent + case when inserted_purchase then p_usd_micros else 0 end,
    'deliveryMode',s.delivery_mode,
    'vestingEntitlementCreated',inserted_purchase and (s.delivery_mode='claim' or s.vesting_enabled)
  );
end;
$$;

revoke all on function launchpad_apply_confirmed_purchase(uuid,text,bigint,numeric,bigint,text,text,uuid,bigint) from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='service_role') then
   grant execute on function launchpad_apply_confirmed_purchase(uuid,text,bigint,numeric,bigint,text,text,uuid,bigint) to service_role;
 end if;
end $$;

-- ===== 016_vault_authority_and_recovery.sql =====
-- PowerChain Launchpad 1.0.0: bind each sale to the verified Token-2022 vault authority.
alter table if exists public.launchpad_sales
  add column if not exists source_vault_authority text;

create index if not exists launchpad_sales_source_vault_authority_idx
  on public.launchpad_sales(source_vault_authority)
  where source_vault_authority is not null;

comment on column public.launchpad_sales.source_vault_authority is
  'Verified owner/authority of source_vault_token_account at sale draft creation.';

-- ===== 017_payment_settlement_evidence.sql =====
-- PowerChain Launchpad 1.0.0 — exact payment/proceeds settlement evidence.
alter table if exists public.launchpad_purchases
  add column if not exists payment_asset_kind text,
  add column if not exists payment_amount_base_units numeric(30,0),
  add column if not exists service_fee_payment_base_units numeric(30,0),
  add column if not exists payment_verified_at timestamptz,
  add column if not exists payment_rpc_endpoint text;

alter table if exists public.launchpad_purchases
  drop constraint if exists launchpad_purchases_payment_asset_kind_check;
alter table if exists public.launchpad_purchases
  add constraint launchpad_purchases_payment_asset_kind_check
  check (payment_asset_kind is null or payment_asset_kind in ('native-sol'));

create index if not exists launchpad_purchases_payment_verified_idx
  on public.launchpad_purchases(sale_id,payment_verified_at)
  where payment_verified_at is not null;

comment on column public.launchpad_purchases.payment_verified_at is
  'Timestamp when PowerChain verified exact on-chain proceeds + 2.5% service-fee balance deltas.';

-- ===== 018_confirmation_recovery_state.sql =====
-- PowerChain Launchpad 1.0.0 — resumable confirmation/reconciliation state.
alter table if exists public.launchpad_transaction_reviews
  add column if not exists settlement_stage text not null default 'prepared',
  add column if not exists confirmation_attempts integer not null default 0,
  add column if not exists last_confirmation_check_at timestamptz,
  add column if not exists next_confirmation_check_at timestamptz,
  add column if not exists last_confirmation_error text;

alter table if exists public.launchpad_transaction_reviews
  drop constraint if exists launchpad_transaction_reviews_settlement_stage_check;
alter table if exists public.launchpad_transaction_reviews
  add constraint launchpad_transaction_reviews_settlement_stage_check check (
    settlement_stage in ('prepared','submitted','chain-confirmed','payment-verified','delivery-verified','settled','failed','expired')
  );

create index if not exists launchpad_reviews_recovery_idx
  on public.launchpad_transaction_reviews(status,next_confirmation_check_at,created_at)
  where status='submitted';

create or replace function public.launchpad_mark_confirmation_attempt(
  p_review_id uuid,
  p_error text default null
) returns table(attempts integer,next_check_at timestamptz)
language plpgsql
security definer
set search_path=public
as $$
begin
  update public.launchpad_transaction_reviews
     set confirmation_attempts=confirmation_attempts+1,
         last_confirmation_check_at=now(),
         last_confirmation_error=left(p_error,500),
         next_confirmation_check_at=now() + make_interval(secs => least(60, power(2,least(confirmation_attempts,5))::integer))
   where id=p_review_id
   returning confirmation_attempts,next_confirmation_check_at into attempts,next_check_at;
  if not found then raise exception 'review_not_found'; end if;
  return next;
end;
$$;

revoke all on function public.launchpad_mark_confirmation_attempt(uuid,text) from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='service_role') then
  grant execute on function public.launchpad_mark_confirmation_attempt(uuid,text) to service_role;
 end if;
end $$;

-- ===== 019_claim_transaction_fee_evidence.sql =====
-- PowerChain Launchpad 1.0.0 — claim/transaction fee evidence and wallet history indexes.
alter table if exists public.launchpad_claims
  add column if not exists reviewed_network_fee_lamports numeric(30,0),
  add column if not exists reviewed_rent_lamports numeric(30,0),
  add column if not exists reviewed_service_fee_lamports numeric(30,0) not null default 0,
  add column if not exists confirmed_slot bigint;

alter table if exists public.launchpad_claims
  drop constraint if exists launchpad_claims_no_service_fee;
alter table if exists public.launchpad_claims
  add constraint launchpad_claims_no_service_fee check (reviewed_service_fee_lamports = 0);

create index if not exists launchpad_transaction_reviews_wallet_created_idx
  on public.launchpad_transaction_reviews(wallet,created_at desc);
create index if not exists launchpad_transaction_reviews_wallet_kind_stage_idx
  on public.launchpad_transaction_reviews(wallet,kind,settlement_stage,created_at desc);

comment on column public.launchpad_claims.reviewed_service_fee_lamports is
  'PowerChain service fee for claims. Must remain zero in Launchpad 1.0.0.';

-- ===== 020_monotonic_settlement_and_purchase_review_guard.sql =====
-- PowerChain Launchpad 1.0.0 — monotonic transaction settlement state and live purchase review guard.

create or replace function public.launchpad_advance_review_stage(
  p_review_id uuid,
  p_stage text,
  p_status text default null,
  p_error text default null
) returns table(settlement_stage text,status text)
language plpgsql
security definer
set search_path=public
as $$
declare
  v_current text;
  v_current_rank integer;
  v_next_rank integer;
begin
  if p_stage not in ('prepared','submitted','chain-confirmed','payment-verified','delivery-verified','settled','failed','expired') then
    raise exception 'invalid_settlement_stage';
  end if;

  select r.settlement_stage into v_current
    from public.launchpad_transaction_reviews r
   where r.id=p_review_id
   for update;
  if not found then raise exception 'review_not_found'; end if;

  -- Terminal states never move again. This protects against delayed/reordered retries.
  if v_current in ('settled','failed','expired') then
    return query select r.settlement_stage,r.status from public.launchpad_transaction_reviews r where r.id=p_review_id;
    return;
  end if;

  if p_stage in ('failed','expired') then
    update public.launchpad_transaction_reviews
       set settlement_stage=p_stage,
           status=coalesce(p_status,p_stage),
           last_confirmation_error=case when p_error is null then last_confirmation_error else left(p_error,500) end
     where id=p_review_id;
    return query select r.settlement_stage,r.status from public.launchpad_transaction_reviews r where r.id=p_review_id;
    return;
  end if;

  v_current_rank=case v_current
    when 'prepared' then 0 when 'submitted' then 1 when 'chain-confirmed' then 2
    when 'payment-verified' then 3 when 'delivery-verified' then 4 when 'settled' then 5 else -1 end;
  v_next_rank=case p_stage
    when 'prepared' then 0 when 'submitted' then 1 when 'chain-confirmed' then 2
    when 'payment-verified' then 3 when 'delivery-verified' then 4 when 'settled' then 5 else -1 end;

  if v_next_rank < v_current_rank then
    return query select r.settlement_stage,r.status from public.launchpad_transaction_reviews r where r.id=p_review_id;
    return;
  end if;

  update public.launchpad_transaction_reviews
     set settlement_stage=p_stage,
         status=coalesce(p_status,case when p_stage='settled' then 'confirmed' when p_stage='submitted' then 'submitted' else status end),
         last_confirmation_error=case when p_error is null then last_confirmation_error else left(p_error,500) end
   where id=p_review_id;
  return query select r.settlement_stage,r.status from public.launchpad_transaction_reviews r where r.id=p_review_id;
end;
$$;

revoke all on function public.launchpad_advance_review_stage(uuid,text,text,text) from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='service_role') then
  grant execute on function public.launchpad_advance_review_stage(uuid,text,text,text) to service_role;
 end if;
end $$;

-- Only one live purchase review is allowed for a wallet/sale pair. Expired/failed/settled
-- reviews do not block a new purchase. The application additionally checks expiry before prepare.
create unique index if not exists launchpad_reviews_one_live_purchase_per_wallet_sale
  on public.launchpad_transaction_reviews(sale_id,wallet)
  where kind='purchase' and status in ('prepared','submitted');

-- ===== 021_reconciliation_leases_and_ops.sql =====
-- PowerChain Launchpad 1.0.0 - reconciliation lease + operational indexes
create table if not exists public.launchpad_operation_leases (
  name text primary key,
  holder text not null,
  acquired_at timestamptz not null default now(),
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.launchpad_operation_leases enable row level security;
revoke all on table public.launchpad_operation_leases from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='anon') then revoke all on table public.launchpad_operation_leases from anon; end if;
 if exists(select 1 from pg_roles where rolname='authenticated') then revoke all on table public.launchpad_operation_leases from authenticated; end if;
 if exists(select 1 from pg_roles where rolname='service_role') then grant all on table public.launchpad_operation_leases to service_role; end if;
end $$;

create or replace function public.launchpad_acquire_operation_lease(
  p_name text,
  p_holder text,
  p_ttl_seconds integer default 240
) returns boolean
language plpgsql security definer set search_path=public as $$
declare v_rows integer := 0;
begin
  if p_name is null or length(p_name) > 80 or p_holder is null or length(p_holder) > 120 then return false; end if;
  if p_ttl_seconds < 30 or p_ttl_seconds > 900 then raise exception 'invalid_lease_ttl'; end if;
  insert into public.launchpad_operation_leases(name,holder,acquired_at,expires_at,updated_at)
  values(p_name,p_holder,now(),now()+make_interval(secs=>p_ttl_seconds),now())
  on conflict(name) do update set
    holder=excluded.holder, acquired_at=excluded.acquired_at,
    expires_at=excluded.expires_at, updated_at=excluded.updated_at
  where public.launchpad_operation_leases.expires_at <= now()
     or public.launchpad_operation_leases.holder = excluded.holder;
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end; $$;

create or replace function public.launchpad_release_operation_lease(p_name text,p_holder text)
returns boolean language plpgsql security definer set search_path=public as $$
declare v_deleted integer;
begin
 delete from public.launchpad_operation_leases where name=p_name and holder=p_holder;
 get diagnostics v_deleted = row_count;
 return v_deleted > 0;
end; $$;

revoke all on function public.launchpad_acquire_operation_lease(text,text,integer) from public;
revoke all on function public.launchpad_release_operation_lease(text,text) from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='service_role') then
  grant execute on function public.launchpad_acquire_operation_lease(text,text,integer) to service_role;
  grant execute on function public.launchpad_release_operation_lease(text,text) to service_role;
 end if;
end $$;

create index if not exists launchpad_reviews_retry_due_idx
 on public.launchpad_transaction_reviews(next_confirmation_check_at,status)
 where status='submitted';
create index if not exists launchpad_audit_recent_ops_idx
 on public.launchpad_audit(created_at desc,action);

-- ===== 022_mainnet_sale_binding.sql =====
-- PowerChain Launchpad 1.0.0 - bind sale records to the verified Solana network identity
alter table public.launchpad_sales add column if not exists cluster text not null default 'mainnet-beta';
alter table public.launchpad_sales add column if not exists genesis_hash text;
alter table public.launchpad_sales add column if not exists token_program text not null default 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';

alter table public.launchpad_sales drop constraint if exists launchpad_sales_cluster_check;
alter table public.launchpad_sales add constraint launchpad_sales_cluster_check check(cluster in ('devnet','mainnet-beta'));
alter table public.launchpad_sales drop constraint if exists launchpad_sales_token_program_check;
alter table public.launchpad_sales add constraint launchpad_sales_token_program_check check(token_program='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
create index if not exists launchpad_sales_network_phase_idx on public.launchpad_sales(cluster,phase,starts_at);

-- ===== 023_integrations_fee_market_data.sql =====
-- PowerChain Launchpad 1.0.0 — canonical fee routing + provider/market data persistence.

alter table if exists public.launchpad_sales
  add column if not exists fee_wallet text not null default 'FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy',
  add column if not exists launchpad_program_id text;

alter table if exists public.launchpad_sales drop constraint if exists launchpad_sales_fee_wallet_check;
alter table if exists public.launchpad_sales add constraint launchpad_sales_fee_wallet_check
  check (fee_wallet = 'FeeszhrKKEsvxr1kg8LDtPx6BLcEbYHiAThYaxajNhqy');

create table if not exists public.launchpad_token_market_snapshots (
  id bigint generated always as identity primary key,
  mint text not null,
  price_usd numeric(38,18),
  liquidity_usd numeric(38,6),
  market_data jsonb not null default '{}'::jsonb,
  asset_data jsonb not null default '{}'::jsonb,
  source text not null default 'birdeye+helius',
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists launchpad_market_snapshots_mint_observed_idx on public.launchpad_token_market_snapshots(mint,observed_at desc);

alter table public.launchpad_token_market_snapshots enable row level security;
revoke all on table public.launchpad_token_market_snapshots from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='anon') then revoke all on table public.launchpad_token_market_snapshots from anon; end if;
 if exists(select 1 from pg_roles where rolname='authenticated') then revoke all on table public.launchpad_token_market_snapshots from authenticated; end if;
 if exists(select 1 from pg_roles where rolname='service_role') then grant all on table public.launchpad_token_market_snapshots to service_role; end if;
end $$;

comment on column public.launchpad_sales.fee_wallet is 'Canonical PowerChain 2.5% service-fee recipient for Launchpad 1.0.0.';
comment on table public.launchpad_token_market_snapshots is 'Server-cached Birdeye/Helius market and asset observations. Never settlement truth.';

-- ===== 024_launchpad_program_operations.sql =====
-- PowerChain Launchpad 1.0.0 — on-chain program binding and operation evidence.

alter table if exists public.launchpad_transaction_reviews
  drop constraint if exists launchpad_transaction_reviews_kind_check;
alter table if exists public.launchpad_transaction_reviews
  add constraint launchpad_transaction_reviews_kind_check check (kind in (
    'claim','sale-activation','purchase','sale-cancel','sale-complete',
    'program-pause','program-resume','program-update-timing'
  ));

alter table if exists public.launchpad_sales
  add column if not exists sale_pda text,
  add column if not exists vault_authority_pda text,
  add column if not exists program_state_version integer not null default 1,
  add column if not exists onchain_initialized_at timestamptz,
  add column if not exists onchain_status text,
  add column if not exists quote_authority_wallet text;

create unique index if not exists launchpad_sales_sale_pda_uq on public.launchpad_sales(sale_pda) where sale_pda is not null;
create index if not exists launchpad_sales_program_binding_idx on public.launchpad_sales(launchpad_program_id,sale_pda);

alter table if exists public.launchpad_purchases
  add column if not exists participant_pda text,
  add column if not exists program_purchase_nonce bigint,
  add column if not exists program_operation_verified_at timestamptz;

alter table if exists public.launchpad_claims
  add column if not exists participant_pda text,
  add column if not exists program_operation_verified_at timestamptz;

create table if not exists public.launchpad_program_operations (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.launchpad_transaction_reviews(id) on delete set null,
  sale_id uuid not null references public.launchpad_sales(id) on delete cascade,
  wallet text not null,
  operation text not null check (operation in ('initialize-sale','adopt-vault-authority','purchase','claim','pause','resume','update-timing','cancel','complete')),
  program_id text not null,
  sale_pda text not null,
  participant_pda text,
  instruction_data_base64 text,
  signature text,
  status text not null default 'prepared' check (status in ('prepared','submitted','confirmed','failed','expired')),
  confirmed_slot bigint,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);
create index if not exists launchpad_program_operations_sale_idx on public.launchpad_program_operations(sale_id,created_at desc);
create index if not exists launchpad_program_operations_wallet_idx on public.launchpad_program_operations(wallet,created_at desc);
drop index if exists public.launchpad_program_operations_signature_uq;
create unique index if not exists launchpad_program_operations_signature_operation_uq on public.launchpad_program_operations(signature,operation) where signature is not null;

alter table public.launchpad_program_operations enable row level security;
revoke all on table public.launchpad_program_operations from public;
do $$ begin
 if exists(select 1 from pg_roles where rolname='anon') then revoke all on table public.launchpad_program_operations from anon; end if;
 if exists(select 1 from pg_roles where rolname='authenticated') then revoke all on table public.launchpad_program_operations from authenticated; end if;
 if exists(select 1 from pg_roles where rolname='service_role') then grant all on table public.launchpad_program_operations to service_role; end if;
end $$;

comment on table public.launchpad_program_operations is 'Audit evidence for PowerChain Launchpad on-chain program instructions. Serialized wallet transactions are never stored here.';
comment on column public.launchpad_sales.sale_pda is 'Deterministic sale PDA derived from real deployed program ID, creator, mint and sale UUID.';
comment on column public.launchpad_sales.vault_authority_pda is 'Program-derived authority expected to own the Token-2022 sale vault after activation.';
comment on column public.launchpad_sales.quote_authority_wallet is 'Public signer address that must co-sign server-authorized purchase quotes; private key stays outside the Launchpad repository/browser.';

-- Reconcile creator lifecycle rules with immediate-vs-claim delivery semantics.
-- Immediate-delivery sales do not accumulate launchpad_claims and therefore must not
-- be blocked from completion merely because claimed_tokens is zero.
create or replace function public.launchpad_apply_sale_action(
  p_sale_id uuid,
  p_creator_wallet text,
  p_action text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_phase text;
  owner_wallet text;
  delivery text;
  confirmed_purchases bigint := 0;
  purchased_tokens numeric := 0;
  claimed_tokens numeric := 0;
begin
  if p_action not in ('cancel','complete') then raise exception 'invalid_sale_action'; end if;

  select phase, creator_wallet, delivery_mode
    into current_phase, owner_wallet, delivery
    from public.launchpad_sales where id=p_sale_id for update;
  if not found then raise exception 'sale_not_found'; end if;
  if owner_wallet <> p_creator_wallet then raise exception 'creator_mismatch'; end if;

  if p_action='cancel' then
    if current_phase='cancelled' then return 'cancelled'; end if;
    if current_phase='completed' then raise exception 'completed_sale_cannot_cancel'; end if;
    select count(*) into confirmed_purchases from public.launchpad_purchases
      where sale_id=p_sale_id and status='confirmed';
    if confirmed_purchases > 0 then raise exception 'sale_has_confirmed_purchases'; end if;
    update public.launchpad_sales set phase='cancelled', cancelled_at=coalesce(cancelled_at,now()) where id=p_sale_id;
    return 'cancelled';
  end if;

  if current_phase='completed' then return 'completed'; end if;
  if current_phase='cancelled' then raise exception 'cancelled_sale_cannot_complete'; end if;
  if current_phase not in ('ended','claimable') then raise exception 'sale_not_ready_to_complete'; end if;

  if delivery='claim' then
    select coalesce(sum(token_base_units),0) into purchased_tokens
      from public.launchpad_purchases where sale_id=p_sale_id and status='confirmed';
    select coalesce(sum(amount_base_units),0) into claimed_tokens
      from public.launchpad_claims where sale_id=p_sale_id;
    if claimed_tokens < purchased_tokens then raise exception 'unclaimed_tokens_remain'; end if;
  end if;

  update public.launchpad_sales set phase='completed', completed_at=coalesce(completed_at,now()) where id=p_sale_id;
  return 'completed';
end;
$$;
-- PowerChain Launchpad 1.0.0 — non-custodial wallet transfers and asset/checkout evidence.
alter table if exists public.launchpad_transaction_reviews
  drop constraint if exists launchpad_transaction_reviews_kind_check;
alter table if exists public.launchpad_transaction_reviews
  add constraint launchpad_transaction_reviews_kind_check check (kind in (
    'claim','sale-activation','purchase','sale-cancel','sale-complete',
    'program-pause','program-resume','program-update-timing','wallet-transfer'
  ));
create index if not exists launchpad_wallet_transfer_reviews_idx
  on public.launchpad_transaction_reviews(wallet,created_at desc)
  where kind='wallet-transfer';
create unique index if not exists launchpad_one_live_wallet_transfer_review
  on public.launchpad_transaction_reviews(wallet)
  where kind='wallet-transfer' and status in ('prepared','submitted');
comment on index public.launchpad_wallet_transfer_reviews_idx is 'Wallet-scoped PWRC/SOL transfer receipt lookup.';


-- Migration 026
-- PowerChain Launchpad 1.0.0 - Coinbase-hosted Onramp audit state.
create table if not exists public.launchpad_onramp_sessions (
  id uuid primary key default gen_random_uuid(),
  partner_user_ref text not null unique,
  wallet text not null,
  sale_id uuid not null references public.launchpad_sales(id) on delete cascade,
  provider text not null default 'coinbase-hosted' check (provider = 'coinbase-hosted'),
  purchase_asset text not null default 'SOL' check (purchase_asset = 'SOL'),
  destination_network text not null default 'solana' check (destination_network = 'solana'),
  payment_currency text not null default 'USD' check (payment_currency = 'USD'),
  requested_payment_amount numeric(30,2) not null check (requested_payment_amount >= 5),
  provider_status text not null default 'session-created',
  provider_transaction_id text,
  provider_tx_hash text,
  created_at timestamptz not null default now(),
  last_checked_at timestamptz,
  completed_at timestamptz
);
create index if not exists launchpad_onramp_wallet_created_idx on public.launchpad_onramp_sessions(wallet,created_at desc);
create index if not exists launchpad_onramp_sale_created_idx on public.launchpad_onramp_sessions(sale_id,created_at desc);
alter table public.launchpad_onramp_sessions enable row level security;
revoke all on public.launchpad_onramp_sessions from anon, authenticated;
grant select,insert,update on public.launchpad_onramp_sessions to service_role;

-- Migration 027
-- Account profile metadata for Supabase Auth identities.
create table if not exists public.launchpad_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text,
  display_name text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists launchpad_profiles_auth_user_idx on public.launchpad_profiles(auth_user_id);
alter table public.launchpad_profiles enable row level security;
revoke all on public.launchpad_profiles from anon, authenticated;
grant select,insert,update on public.launchpad_profiles to service_role;
