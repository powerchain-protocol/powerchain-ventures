# PowerChain Environment Profiles

Environment values are separated by runtime and deployment target.

## Files

```text
env/
├── README.md
├── local.example
├── production.example
├── mainnet-beta.example
└── devnet.example
```

App-specific Next/Expo environment files remain under each app because those
frameworks load their own `.env*` files automatically.

## Mainnet recommendation

Frontend/browser:

```text
NEXT_PUBLIC_SOLANA_RPC_URL=https://backend.powerchain.energy/api/v1/solana/rpc
```

Backend:

```text
SOLANA_RPC_PROVIDER=helius
HELIUS_API_KEY=<server secret>
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/
HELIUS_API_URL=https://api.helius.xyz
CUSTOM_SOLANA_RPC_URL=<second dedicated RPC>
```

The browser uses the PowerChain backend RPC proxy so the Helius API key is not
placed in `NEXT_PUBLIC_*`.

## Provider selection

`SOLANA_RPC_PROVIDER`:

- `auto` — Helius when configured, then custom, then legacy RPC values
- `helius` — Helius primary; requires `HELIUS_API_KEY`
- `custom` — custom primary; requires `CUSTOM_SOLANA_RPC_URL`
- `solana` — official Solana public RPC, intended for development only

Production mainnet requires at least two dedicated server-side RPC endpoints.

## Origins

Use exactly one URL for:

```text
NEXT_PUBLIC_APP_URL
BACKEND_ORIGIN
```

Multiple browser origins belong only in:

```text
ALLOWED_ORIGINS=https://launchpad.powerchain.energy,https://www.powerchain.energy
```
