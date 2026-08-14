# PowerChain Account Auth & Mobile Onboarding

PowerChain Launchpad 1.0.0 separates **account authentication** from **wallet custody**.

- Account auth uses Supabase Auth email/password identities.
- Auth access/refresh tokens are brokered by the backend and stored in `HttpOnly`, `SameSite=Lax` cookies.
- Wallet connection remains non-custodial and is never treated as possession of an account password.
- Sensitive Launchpad transactions still require the connected wallet's explicit signature and the existing exact-message verification pipeline.

## Mobile onboarding

`/onboarding` contains four first-run screens covering Launchpad discovery, wallet safety, Solana transaction review and account options. Completion is stored as the non-sensitive `pc_onboarding` cookie and local preference.

## Account routes

- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/callback`
- `/auth/update-password`
- `/account`

Creator routes `/dashboard` and `/create` are account-gated in the frontend proxy. Backend financial security does not rely on that UI gate; wallet signatures, creator ownership and settlement verification remain authoritative.

## Backend API

- `GET /api/v1/auth/config`
- `POST /api/v1/auth/sign-in`
- `POST /api/v1/auth/sign-up`
- `GET|POST /api/v1/auth/session`
- `POST /api/v1/auth/sign-out`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/update-password`

Sign-in, sign-up and password recovery are additionally protected by the existing distributed PostgreSQL rate limiter.

## Required configuration

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PUBLISHABLE_KEY=
# or legacy: SUPABASE_ANON_KEY=
POWERCHAIN_AUTH_ENABLED=true
POWERCHAIN_AUTH_REDIRECT_URL=https://launchpad.example.com/auth/callback
```

Configure the callback URL in the Supabase Auth redirect allow list. Authentication emails should target the PowerChain callback URL.

## Database

Migration `027_account_auth_profiles.sql` creates `launchpad_profiles` for non-secret profile metadata only. Passwords, access tokens and refresh tokens are never stored in this table.
