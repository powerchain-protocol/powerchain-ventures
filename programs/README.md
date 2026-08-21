# PowerChain Launchpad Solana Program v1.6.0

`programs/src/` contains the low-level wallet-authorized launch lifecycle scaffold used by the API transaction builder.

Current instructions: `Initialize`, `Configure`, `MoveToReview`, `Activate`, `Pause`, and `Finalize`.

The program verifies PDA seeds, account ownership and authority signatures, rejects reinitialization, rejects malformed/trailing instruction data and enforces explicit lifecycle transitions.

```bash
pnpm program:check
pnpm program:test
```

Set `POWERCHAIN_LAUNCHPAD_PROGRAM_ID` to the deployed program ID for the selected cluster. Do not use a placeholder program ID for production transaction preparation.
