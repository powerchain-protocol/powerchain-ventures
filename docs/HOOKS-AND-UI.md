# Hooks and UI Runtime Guide

PowerChain Launchpad keeps browser-only behavior inside focused client hooks so sale, claim, transaction, and configuration components stay predictable during Next.js server rendering.

## Hooks

### `use-media-query.ts`

Use for responsive behavior that cannot be expressed in CSS alone. It never reads `window` during server render and keeps MediaQueryList listeners cleaned up.

### `use-copy-to-clipboard.ts`

Provides `idle | copied | error` feedback without letting Clipboard API failures escape UI event handlers. Feedback resets automatically.

### `use-click-outside.ts`

Used for popovers such as the connected-wallet menu. Pointer activity outside the owner or `Escape` closes the surface and event listeners are removed on cleanup.

### `use-countdown.ts`

Owns countdown timing for sale and quote expiry. The interval stops when the target completes, invalid dates fail visibly, and `onComplete` fires only once per target.

### `use-embedded-wallets.ts`

Discovers adapter availability and restores only validated non-secret session metadata. The hook never handles seed phrases, private keys, mnemonics, or recovery material.

### `useSerializedTransactionSigner()`

Signs only a server-prepared serialized Solana transaction after the review stage. Invalid base64 payloads and missing signatures fail before the confirmation pipeline.

## Wallet UX rules

- Wallet connectivity is non-custodial.
- The modal traps keyboard focus while open and restores the previously focused element on close.
- `Escape` and backdrop click close the modal.
- The connected-wallet menu closes on outside click or `Escape`.
- Copy-address actions show success/failure feedback.
- Transaction signing remains gated by the exact PowerChain transaction review.

## Navigation

The primary navigation is route-aware and uses `aria-current="page"`. Desktop links collapse into an accessible mobile menu below the compact breakpoint so the header does not overflow on phones or small tablets.

## Configuration loading

`PowerChainConfigProvider` uses the shared retry/timeout policy and aborts superseded requests. A stale response cannot overwrite a newer refresh result, and an unmounted provider does not attempt to update state.

## Error-state policy

Browser/runtime failures should be presented as an actionable state instead of swallowed:

- invalid schedule → `Schedule unavailable`
- wallet provider missing → wallet empty state
- clipboard unavailable → `Copy failed`
- invalid prepared transaction → signing blocked
- deployment config unavailable → mainnet actions remain disabled
