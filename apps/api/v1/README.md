# PowerChain API v1

Canonical runtime router: `apps/api/src/api/v1/router.ts`  
Base path: `/api/v1`

| Area | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| Health | `GET /health`, `/health/live`, `/health/ready` | public | process/dependency state |
| Account | `GET /account/me` | session | authenticated account |
| Account | `PATCH /account/profile` | session | profile |
| Account | `GET/PATCH /account/settings` | session | preferences |
| Launches | `GET /launches`, `/launches/:id` | public | discovery/detail |
| Launches | `GET /launches/:id/readiness`, `/health` | public | readiness + health |
| Launches | `GET /launches/:id/overview` | manager | combined operator snapshot |
| Launches | `GET /launches/:id/timeline` | manager | lifecycle/transaction timeline |
| Launches | `GET /launches/:id/treasury` | manager | raised/settlement state |
| Launches | `GET /launches/:id/authorities` | manager | authority state |
| Campaigns | `POST /campaigns` | session | create draft + first phase |
| Campaigns | `POST /campaigns/:id/prepare-launch` | manager | build/simulate unsigned activation |
| Campaigns | `POST /campaigns/:id/confirm-launch` | manager | verify chain signature/state |
| Eligibility | `POST /eligibility/check` | route policy | participation check |
| Transactions | `POST /transactions/simulate` | rate limited | unsigned simulation |
| Solana | `GET /solana/status` | public | RPC/fallback status |
| Solana | `GET /solana/wallets/:address/*` | public/rate limited | balance, assets, history, transfers |
| Market | `GET /market/price` | public | normalized single price |
| Market | `GET /market/prices` | public | normalized batch prices |
| Market | `GET /market/providers` | public | provider health |
| Lifecycle | `GET /lifecycle/*` | manager | participants, claims, settlements, activity |
| System | `GET /system/runtime` | public | sanitized runtime |
| System | `GET /system/fallbacks` | public | RPC/market/realtime fallback state |
| System | `GET /system/realtime` | public | WebSocket counters/heartbeat |
| Realtime | `WS /ws` | mixed | public `market:*`, protected `launch:*` |

Better Auth is exposed separately under `/api/auth/*` before Express JSON parsing. Every consequential transaction flow remains **prepare → validate → simulate → wallet sign → chain confirmation → server verification**.
