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
