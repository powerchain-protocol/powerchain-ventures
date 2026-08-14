# PowerChain Launchpad 1.0.0 — Fees

PowerChain uses one canonical service-fee policy.

- Token purchases: **2.5% (250 bps)** of purchase principal.
- Token claims: **0% PowerChain service fee**.
- Creator lifecycle transactions: **0% PowerChain service fee**.
- Solana network fees are variable and paid to the network.
- Rent is variable and applies only when a transaction creates rent-exempt accounts.

Purchase review separates sale proceeds, PowerChain service fee, Solana network fee, rent, and the estimated total wallet debit. Claim review explicitly shows the zero PowerChain service fee and only the Solana costs.

All values are represented in integer base units. Purchase service-fee payment is verified against the PowerChain treasury balance delta before settlement. Claim fee evidence is persisted with the confirmed claim, with a database constraint requiring the PowerChain claim service fee to remain zero.
