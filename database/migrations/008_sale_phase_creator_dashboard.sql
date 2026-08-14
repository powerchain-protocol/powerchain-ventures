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
