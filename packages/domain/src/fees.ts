export const SERVICE_FEE_BPS = 250n;
export const BPS_DENOMINATOR = 10_000n;

export function calculateServiceFee(
  amount: bigint,
  feeBps = SERVICE_FEE_BPS,
): bigint {
  if (amount < 0n) throw new Error("amount must be non-negative");
  if (feeBps < 0n || feeBps > BPS_DENOMINATOR) {
    throw new Error("invalid fee bps");
  }
  return (
    amount * feeBps + BPS_DENOMINATOR - 1n
  ) / BPS_DENOMINATOR;
}
