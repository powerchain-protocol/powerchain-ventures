-- PowerChain Launchpad 1.0.0 — account profile metadata for Supabase Auth users.
-- Authentication credentials/tokens remain in Supabase Auth and are never stored here.
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
comment on table public.launchpad_profiles is 'PowerChain account profile metadata keyed to Supabase Auth user ID. Passwords and auth tokens are never stored here.';
