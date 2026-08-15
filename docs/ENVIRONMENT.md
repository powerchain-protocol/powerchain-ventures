# Environment and RPC Configuration

PowerChain Launchpad uses mainnet-beta-first environment profiles.

## Browser

The browser should use:

```text
NEXT_PUBLIC_SOLANA_RPC_URL=https://backend.powerchain.energy/api/v1/solana/rpc
```

This prevents Helius/provider secrets from entering browser bundles.

## Backend providers

```text
SOLANA_RPC_PROVIDER=auto|helius|custom|solana
```

Recommended production:

```text
SOLANA_RPC_PROVIDER=helius
HELIUS_API_KEY=<secret>
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/
HELIUS_API_URL=https://api.helius.xyz
CUSTOM_SOLANA_RPC_URL=<independent dedicated fallback>
```

## CORS

Single URLs:

```text
NEXT_PUBLIC_APP_URL=https://launchpad.powerchain.energy
NEXT_PUBLIC_CHECKOUT_URL=https://checkout.powerchain.energy
BACKEND_ORIGIN=https://backend.powerchain.energy
```

Multiple allowed browser origins:

```text
ALLOWED_ORIGINS=https://launchpad.powerchain.energy,https://checkout.powerchain.energy
```

Do not put comma-separated URLs into `NEXT_PUBLIC_APP_URL` or `BACKEND_ORIGIN`.

## Profiles

See `/env/README.md` and the local/production/mainnet/devnet profile examples.


### Market conversion

At least one production SOL/USD source must be configured for SOL-denominated purchase construction. Recommended configuration uses authenticated Pyth with Birdeye and/or CoinMarketCap fallback:

```env
PYTH_API_KEY=
PYTH_HERMES_URL=https://pyth.dourolabs.app/hermes
PYTH_SOL_USD_FEED_ID=

BIRDEYE_API_KEY=
COINMARKETCAP_API_KEY=
PRICE_MAX_AGE_MS=90000
PRICE_MAX_DIVERGENCE_BPS=300
```

Feed IDs and API keys are deployment values and are never exposed through `NEXT_PUBLIC_*`.
