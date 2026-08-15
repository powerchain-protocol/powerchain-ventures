# Payments

PowerChain Launchpad keeps payment presentation separate from authoritative token settlement.

## Canonical rail

The default and always-enabled purchase method is:

```text
SOL → PWRC
```

The backend owns quote conversion, the fixed 250 bps purchase service fee, Launchpad program instruction construction, simulation and settlement verification.

## Payment methods

| Method | Default | Role | PWRC settlement |
| --- | --- | --- | --- |
| SOL → PWRC | enabled | direct purchase | enabled |
| Solana Pay QR | enabled | direct purchase presentation | enabled |
| Coinbase Onramp | disabled | funds SOL | separate purchase required |
| Stripe hosted | disabled | provider-hosted funding | separate purchase required |
| SPL USDC | disabled | future direct purchase adapter | fail closed |
| Circle CCTP V2 | disabled | cross-chain USDC funding/status | separate adapter required |
| SUI | disabled | future direct purchase adapter | fail closed |
| ZK compressed | disabled | optional protocol capability | fail closed |

Other rails are opt-in so adding an integration cannot silently become a production payment method.

## Configuration

Server:

```env
POWERCHAIN_SOLANA_PAY_ENABLED=1
POWERCHAIN_COINBASE_ONRAMP_ENABLED=0
POWERCHAIN_STRIPE_ENABLED=0
STRIPE_HOSTED_CHECKOUT_URL=
POWERCHAIN_USDC_PURCHASE_ENABLED=0
POWERCHAIN_CCTP_ENABLED=0
POWERCHAIN_SUI_PURCHASE_ENABLED=0
POWERCHAIN_ZK_COMPRESSION_ENABLED=0
```

Checkout/browser:

```env
NEXT_PUBLIC_SOLANA_PAY_ENABLED=1
NEXT_PUBLIC_COINBASE_ONRAMP_ENABLED=0
NEXT_PUBLIC_STRIPE_ENABLED=0
NEXT_PUBLIC_USDC_PURCHASE_ENABLED=0
NEXT_PUBLIC_CCTP_ENABLED=0
NEXT_PUBLIC_SUI_PURCHASE_ENABLED=0
NEXT_PUBLIC_ZK_COMPRESSION_ENABLED=0
```

`GET /api/v1/payments/config` is the browser-safe server view of payment capabilities.

## Coinbase Onramp

Coinbase is a wallet-funding rail. It becomes available only when both the PowerChain rail flag and the existing CDP provider flag are enabled and the CDP credentials are configured.

```env
POWERCHAIN_COINBASE_ONRAMP_ENABLED=1
CDP_ONRAMP_ENABLED=true
```

Funding SOL is not proof of a PWRC purchase.

## Stripe

Stripe is provider-hosted only:

```env
POWERCHAIN_STRIPE_ENABLED=1
STRIPE_HOSTED_CHECKOUT_URL=https://...
NEXT_PUBLIC_STRIPE_ENABLED=1
```

PowerChain Checkout never asks for or stores raw card number, CVV or expiry data. The hosted Stripe page is treated as funding, not token settlement.

## USDC and CCTP

Native SPL USDC and CCTP V2 are disabled until a reviewed purchase/funding adapter is intentionally enabled. Program/address metadata being present does not imply that a payment rail is active.

## Fee policy

Only a purchase carries the PowerChain purchase service fee:

```text
250 bps = 2.5%
```

Claims, wallet transfers and creator lifecycle actions do not add a PowerChain service fee.
