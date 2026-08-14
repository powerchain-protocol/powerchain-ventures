-- PowerChain Launchpad 1.0.0 - bind sale records to the verified Solana network identity
alter table public.launchpad_sales add column if not exists cluster text not null default 'mainnet-beta';
alter table public.launchpad_sales add column if not exists genesis_hash text;
alter table public.launchpad_sales add column if not exists token_program text not null default 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';

alter table public.launchpad_sales drop constraint if exists launchpad_sales_cluster_check;
alter table public.launchpad_sales add constraint launchpad_sales_cluster_check check(cluster in ('devnet','mainnet-beta'));
alter table public.launchpad_sales drop constraint if exists launchpad_sales_token_program_check;
alter table public.launchpad_sales add constraint launchpad_sales_token_program_check check(token_program='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
create index if not exists launchpad_sales_network_phase_idx on public.launchpad_sales(cluster,phase,starts_at);
