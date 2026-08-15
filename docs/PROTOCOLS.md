# Solana and Payment Protocols

PowerChain keeps protocol identifiers centralized in `packages/config/src/solana-programs.ts` and feature/status adapters in `packages/integrations`.

## Solana token programs

```text
System Program
11111111111111111111111111111111

SPL Token Program
TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

Token-2022 Program
TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

Associated Token Program
ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL
```

`@powerchain/solana/tokens` uses `@solana/web3.js` and `@solana/spl-token` for address parsing, SPL/Token-2022 program selection and ATA derivation.

The PowerChain Launchpad program address is intentionally not hard-coded. `POWERCHAIN_LAUNCHPAD_PROGRAM_ID` must be populated only with the verified deployment.

## Pyth Core on Solana

Pyth Core has an August 18, 2026 Solana upgrade window. Both generations are recorded so the operator cannot accidentally mix receiver and price-feed programs.

Current generation:

```text
Wormhole receiver  HDwcJBJXjL9FpJ7UBsYBtaDjsBUhuLCUYoz3zr8SWWaQ
Receiver           rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ
Price feed         pythWSnswVUd12oZpeFP8e9CVaEqJg25g1Vtc2biRsT
```

Upgraded generation:

```text
Wormhole receiver  HDw2E7P8X1SkCyjvoGsfBGAVUutKcj874bXjHrpVYrVL
Receiver           rec2HHDDnjLfj4kE7VyEtFA1HPGQLK33259532cRyHp
Price feed         pyt2F414BA6dPttK6RddPZUdHfapoBN24GL5wbrPCou
```

New PowerChain configuration defaults to the upgraded generation:

```env
PYTH_CORE_GENERATION=upgraded
PYTH_SOLANA_WORMHOLE_RECEIVER_PROGRAM_ID=HDw2E7P8X1SkCyjvoGsfBGAVUutKcj874bXjHrpVYrVL
PYTH_SOLANA_RECEIVER_PROGRAM_ID=rec2HHDDnjLfj4kE7VyEtFA1HPGQLK33259532cRyHp
PYTH_SOLANA_PRICE_FEED_PROGRAM_ID=pyt2F414BA6dPttK6RddPZUdHfapoBN24GL5wbrPCou
```

The production preflight rejects mixed program generations.

## Circle CCTP V2

Solana CCTP V2:

```text
domain                     5
MessageTransmitterV2       CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC
TokenMessengerMinterV2     CCTPV2vPZJS2u2BBsUoscuikbYjnpFmbFsvVuJdgUMQe
```

`@powerchain/integrations/cctp` provides a bounded Iris V2 message/status client. The API route is:

```text
GET /api/v1/protocols/cctp/messages
```

CCTP is disabled by default. The status client does not itself authorize a token purchase or destination mint.

## ZK Compression

ZK Compression is capability-gated. PowerChain records the Light Protocol reference nullifier program:

```text
NFLx5WGPrTHHvdRNsidcrNcLxRruMC92E4yv7zhZBoT
```

Enable only with reviewed compression RPC/proof infrastructure:

```env
POWERCHAIN_ZK_COMPRESSION_ENABLED=1
ZK_COMPRESSION_RPC_URL=https://...
NEXT_PUBLIC_ZK_COMPRESSION_ENABLED=1
```

Merely enabling the flag does not create a compressed-payment settlement path.

## Safe protocol inventory

Browser-safe current configuration is available at:

```text
GET /api/v1/protocols
```

This endpoint returns public program IDs and feature state only. It never returns RPC/provider credentials or signing keys.
