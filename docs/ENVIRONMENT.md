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


### Delegated vault activation

Normal purchases, claims and creator lifecycle/program operations do not require an external transaction builder.

When a sale vault is controlled by the same creator wallet, sale activation is also built locally. If a distinct vault authority must co-sign activation, enable the optional delegated path:

```env
POWERCHAIN_DELEGATED_VAULT_ACTIVATION_ENABLED=1
POWERCHAIN_TRANSACTION_BUILDER_URL=https://builder.example
POWERCHAIN_TRANSACTION_BUILDER_API_KEY=<server-secret>
```

When the feature flag is `0`, these external-builder values are optional and do not affect general production readiness.


### Payment and protocol feature gates

The only always-active purchase method is SOL → PWRC. Optional rails are explicitly enabled:

```env
POWERCHAIN_SOLANA_PAY_ENABLED=1
POWERCHAIN_COINBASE_ONRAMP_ENABLED=0
POWERCHAIN_STRIPE_ENABLED=0
POWERCHAIN_USDC_PURCHASE_ENABLED=0
POWERCHAIN_CCTP_ENABLED=0
POWERCHAIN_SUI_PURCHASE_ENABLED=0
POWERCHAIN_ZK_COMPRESSION_ENABLED=0
```

Matching browser presentation flags are `NEXT_PUBLIC_*` and contain no secrets.

Pyth Core Solana program generation is explicit:

```env
PYTH_CORE_GENERATION=upgraded
PYTH_SOLANA_WORMHOLE_RECEIVER_PROGRAM_ID=HDw2E7P8X1SkCyjvoGsfBGAVUutKcj874bXjHrpVYrVL
PYTH_SOLANA_RECEIVER_PROGRAM_ID=rec2HHDDnjLfj4kE7VyEtFA1HPGQLK33259532cRyHp
PYTH_SOLANA_PRICE_FEED_PROGRAM_ID=pyt2F414BA6dPttK6RddPZUdHfapoBN24GL5wbrPCou
```

The production preflight rejects mixed Pyth program generations. Pyth API keys, Circle keys, RPC credentials and any provider credentials stay server-only.

CCTP V2 is disabled by default:

```env
POWERCHAIN_CCTP_ENABLED=0
CCTP_ENVIRONMENT=mainnet
CIRCLE_API_KEY=
```

ZK Compression is disabled by default and requires an explicit proof-capable RPC configuration before the capability guard passes.
