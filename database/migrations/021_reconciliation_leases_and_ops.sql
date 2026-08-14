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
