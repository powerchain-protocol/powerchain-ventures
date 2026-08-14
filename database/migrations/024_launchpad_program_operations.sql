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
