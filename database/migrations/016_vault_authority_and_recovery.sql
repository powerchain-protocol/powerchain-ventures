-- PowerChain Launchpad 1.0.0: bind each sale to the verified Token-2022 vault authority.
alter table if exists public.launchpad_sales
  add column if not exists source_vault_authority text;

create index if not exists launchpad_sales_source_vault_authority_idx
  on public.launchpad_sales(source_vault_authority)
  where source_vault_authority is not null;

comment on column public.launchpad_sales.source_vault_authority is
  'Verified owner/authority of source_vault_token_account at sale draft creation.';
