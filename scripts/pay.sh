#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  cat >&2 <<'EOF'
Usage:
  scripts/pay.sh <recipient> <amount-sol> [reference]

Prints a Solana Pay transfer-request URL.
This helper does not sign or submit a transaction.

For the PowerChain SOL -> PWRC purchase QR, use the Checkout-generated
transaction request instead of a raw transfer request.
EOF
  exit 64
fi

recipient="$1"
amount="$2"
reference="${3:-}"

if [[ ! "$recipient" =~ ^[1-9A-HJ-NP-Za-km-z]{32,44}$ ]]; then
  echo "Invalid Solana recipient" >&2
  exit 65
fi

if [[ ! "$amount" =~ ^([0-9]+)(\.[0-9]+)?$ ]] || [[ "$amount" == "0" ]]; then
  echo "Amount must be a positive decimal SOL value" >&2
  exit 65
fi

url="solana:${recipient}?amount=${amount}&label=PowerChain%20Launchpad&message=PowerChain%20payment"

if [[ -n "$reference" ]]; then
  if [[ ! "$reference" =~ ^[1-9A-HJ-NP-Za-km-z]{32,44}$ ]]; then
    echo "Invalid Solana Pay reference" >&2
    exit 65
  fi
  url="${url}&reference=${reference}"
fi

printf '%s\n' "$url"
