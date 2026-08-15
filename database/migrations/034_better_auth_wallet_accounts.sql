begin;

create table if not exists "user" (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  "emailVerified" boolean not null default false,
  image text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "session" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references "user"(id) on delete cascade,
  token text not null unique,
  "expiresAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists better_auth_session_user_idx
  on "session" ("userId");
create index if not exists better_auth_session_expires_idx
  on "session" ("expiresAt");

create table if not exists "account" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references "user"(id) on delete cascade,
  "accountId" text not null,
  "providerId" text not null,
  "accessToken" text,
  "refreshToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope text,
  "idToken" text,
  password text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("providerId", "accountId")
);

create index if not exists better_auth_account_user_idx
  on "account" ("userId");

create table if not exists verification (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  value text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists better_auth_verification_identifier_idx
  on verification (identifier);
create index if not exists better_auth_verification_expires_idx
  on verification ("expiresAt");

create table if not exists powerchain_wallet_accounts (
  id uuid primary key default gen_random_uuid(),
  chain text not null check (chain in ('solana', 'sui')),
  wallet_address text not null,
  auth_user_id uuid references "user"(id) on delete set null,
  provider text not null default 'wallet-signature',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_authenticated_at timestamptz,
  unique (chain, wallet_address)
);

create index if not exists powerchain_wallet_accounts_user_idx
  on powerchain_wallet_accounts (auth_user_id, updated_at desc);

commit;
