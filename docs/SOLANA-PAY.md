# Solana Pay

PowerChain Checkout supports Solana Pay transaction requests for the same reviewed SOL → PWRC purchase used by the normal wallet-sign flow.

## Default payment

The canonical checkout default is:

```text
SOL → PWRC
```

Solana Pay is an alternate presentation of that exact prepared purchase. It is not a separate price, fee, entitlement or settlement system.

## Transaction request

Checkout prepares the purchase through the authoritative backend first. The QR then encodes:

```text
solana:https://checkout.powerchain.energy/api/v1/payments/solana-pay/transaction?reviewId=<review>
```

The transaction-request endpoint supports:

```text
OPTIONS  CORS preflight
GET      merchant label/icon
POST     { "account": "<buyer public key>" }
```

POST returns the exact serialized transaction that was already reviewed and integrity-hashed. The supplied wallet must equal the buyer wallet bound to the prepared review.

The endpoint deliberately allows public Solana Pay CORS because it returns only a pre-built, buyer-bound transaction and never exposes signing material.

## QR confirmation

Checkout polls:

```text
GET /api/v1/payments/solana-pay/status?reviewId=<review>
```

The backend searches the participant PDA's recent signatures and accepts a signature only after `verifyTransactionMatchesPrepared` proves that its serialized Solana message matches the prepared purchase.

After the signature is found, the normal PowerChain confirmation path verifies payment, service fee, program operation and Token-2022 delivery. Checkout still waits for the durable settlement state `reconciled`.

Polling never signs or submits a transaction.

## Transfer helper

For ordinary Solana Pay transfer-request testing:

```bash
scripts/pay.sh <recipient> <amount-sol> [reference]
```

This helper only prints a Solana Pay URL. It does not sign or submit anything and must not be substituted for the PowerChain purchase transaction request.

## Feature flag

```env
POWERCHAIN_SOLANA_PAY_ENABLED=1
NEXT_PUBLIC_SOLANA_PAY_ENABLED=1
```

The normal connected-wallet SOL → PWRC flow remains available regardless of whether QR presentation is enabled.
