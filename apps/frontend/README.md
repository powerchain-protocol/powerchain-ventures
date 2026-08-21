# PowerChain Ventures Frontend v1.6.0

Next.js 16 marketing and Launch OS surface. It includes light/dark brand presentation, pricing/process/get-started sections, Better Auth login/register/profile/settings, campaign creation, launch transaction review, Privy embedded Solana wallets, external Phantom/Solflare wallets and a launch-specific operations dashboard.

`/dashboard/launch/[id]` consumes the authenticated launch overview API and presents readiness, health, treasury, authority and timeline state. `/dashboard/launch/[id]/review` preserves the final non-custodial execution boundary.

Cloudflare deployment uses `@opennextjs/cloudflare` and Wrangler. Keep all server provider/database/auth secrets out of `NEXT_PUBLIC_*` variables.
