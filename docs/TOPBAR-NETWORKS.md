# Top Bar and Network UI

The release information bar is controlled by:

```text
apps/frontend/config/topbar.ts
```

Current release label:

```text
RC.1
```

Change the message, link, tone or release label in that configuration file.

To disable the top bar without changing code:

```text
NEXT_PUBLIC_TOPBAR_ENABLED=false
```

Users can dismiss a dismissible release bar locally.

## Information and alarms

Reusable notice components:

```text
apps/frontend/components/ui/information.tsx
apps/frontend/components/ui/alarms.tsx
```

## Networks and clusters

Typed network data:

```text
apps/frontend/data/networks.ts
apps/frontend/types/networks.ts
```

Reusable cluster UI:

```text
apps/frontend/components/clusters/
```

Solana mainnet/devnet and Sui mainnet/testnet are represented. Sui network
presentation is enabled, while Sui payment settlement remains disabled until
the reviewed settlement adapter is configured.
