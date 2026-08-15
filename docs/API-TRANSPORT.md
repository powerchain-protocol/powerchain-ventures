# API Transport

All stable application endpoints are under `/api/v1`.

The typed registry is:

```text
packages/config/src/endpoints.ts
```

Discovery/status:

```text
GET /api/v1/endpoints
GET /api/v1/transport/status
GET /api/v1/solana/ws/status
```

## Backend HTTP fallback

The frontend same-origin `/api/v1/*` proxy uses:

```text
BACKEND_ORIGIN=
BACKEND_FALLBACK_ORIGINS=
```

GET/HEAD requests may fail over automatically. Mutations fail over only when
an `Idempotency-Key` is present, preventing unprotected duplicate writes after
an uncertain transport failure.

## Solana RPC fallback

Browser Solana JSON-RPC remains proxied through:

```text
POST /api/v1/solana/rpc
```

Server-side Helius/custom RPC endpoints are tried in configured order.

## WebSockets

Server configuration:

```text
HELIUS_API_KEY=
CUSTOM_SOLANA_WS_URLS=
SOLANA_WS_URL=
```

Optional browser-safe configuration:

```text
NEXT_PUBLIC_SOLANA_WS_URL=
```

Do not put a private Helius API key in `NEXT_PUBLIC_*`.

The shared WebSocket client provides endpoint rotation, exponential reconnect,
automatic resubscription and a 60-second application-level health request.

If a browser-safe WebSocket endpoint is not configured, the frontend uses HTTP
polling for transport/status refreshes.
