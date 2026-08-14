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
