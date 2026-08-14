# PowerChain Launchpad — Mobile Source Survey

## Surface classification

### Marketing / public surfaces
- Web landing page and public documentation
- Public launch catalog and launch details
- Legal / policy information

### Application surfaces
- Checkout and transaction review
- Wallet Center
- Claims and vesting
- Activity / transaction receipts
- Account / authentication
- Creator Console and sale operations

### Native-mobile mapping
- Public discovery remains available before authentication.
- `Home`, `Launches`, `Wallet`, `Activity`, and `Account` map to native bottom tabs.
- Launch detail, checkout, claims, receipts, onboarding, auth, and creator operations map to native Stack screens/modal presentations.
- Account authentication never substitutes for the connected Solana wallet signature required for on-chain operations.

## Screen behavior survey

| Flow | Native behavior |
|---|---|
| First run | Splash → four onboarding cards → Home |
| Authentication | Sign in / Sign up / Confirm email / Recover password |
| Launch discovery | Scrollable native list → sale detail stack |
| Checkout | Amount → quote → review → signing adapter → receipt |
| Wallet | SOL/PWRC balances, receive/send entry points, RPC status |
| Claims | Schedule list → claim detail → review/sign → receipt |
| Activity | Filterable list → native receipt detail |
| Creator | Protected stack, authenticated account required |

## External services

Mobile directly contains only public-safe integration configuration:
- PowerChain API origin
- Solana public/device-safe RPC URL
- Supabase URL + publishable key for Auth

Server-only integrations remain behind the backend:
- Helius
- Birdeye
- Coinbase CDP / Onramp
- Supabase service-role
- Prisma/PostgreSQL
- transaction builder
- quote authority

## Theme extraction

Light is default.

- background: `#F7F9F7`
- surface: `#FFFFFF`
- muted surface: `#EFF3F0`
- text: `#0D1E18`
- muted text: `#68766F`
- border: `#DFE6E1`
- PowerChain green: `#075F3B`
- pressed green: `#064C31`

Dark theme uses `#0B1210` / `#111B17` surfaces and `#F5F8F6` text with `#38A675` green.

## Visual assets

- official green/dark/white PowerChain logo variants
- PWRC coin artwork
- Expo app/adaptive/splash/notification icons
- complete checked-in iOS `AppIcon.appiconset`
- Android launcher icon density set
