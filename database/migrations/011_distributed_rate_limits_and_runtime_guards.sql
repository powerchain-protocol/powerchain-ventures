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
