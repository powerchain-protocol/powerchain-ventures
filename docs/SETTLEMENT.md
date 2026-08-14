# Purchase settlement

PowerChain Launchpad 1.0.0 treats purchase preparation and purchase settlement as separate security boundaries.

1. The backend loads the canonical sale row and validates the active time window, sale phase, wallet eligibility, per-wallet limits, Token-2022 decimals, price, service fee, and remaining allocation.
2. A transaction builder prepares the exact Solana transaction. The review payload is hashed and persisted before it is returned to the browser.
3. The wallet signs only the serialized transaction shown in the final review.
4. The confirmation endpoint verifies the signature through Solana RPC and then calls `launchpad_apply_confirmed_purchase`.
5. PostgreSQL locks the sale row, re-checks allocation and wallet limits, inserts the purchase idempotently, and increments `sold_base_units` in the same transaction.
6. A reconciliation endpoint expires stale prepared/submitted reviews. It is protected by `RECONCILIATION_SECRET` and is intended for a scheduler/cron invocation.

No browser-provided token amount, fee, sale allocation, or prior wallet-spend figure is authoritative at settlement time.

## Exact payment settlement evidence

Purchase settlement is two-sided. PowerChain does not mark a purchase complete only because the buyer token delivery succeeded. The transaction builder must expose an exact native-SOL settlement contract containing the sale-proceeds amount, PowerChain service-fee amount, sale receiver, and PowerChain treasury. The fee amount must equal exactly 2.5% of the reviewed purchase proceeds, rounded up in lamports.

After Solana confirms the exact reviewed transaction message, the backend fetches the confirmed transaction and verifies that the sale receiver balance increased by the exact reviewed proceeds and the PowerChain treasury balance increased by the exact reviewed service fee. Only then can database settlement proceed. The verified amounts, RPC endpoint, and timestamp are persisted on the purchase for reconciliation and audit.

The sale proceeds wallet and PowerChain treasury must be distinct. If the production transaction builder does not emit this settlement contract, purchase preparation fails closed and no signable transaction is returned.
