const ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
export function isSolanaAddress(value: unknown): value is string {
  return typeof value === "string" && ADDRESS.test(value);
}
export function parsePositiveBigInt(value: unknown, field: string): bigint {
  if (typeof value !== "string" || !/^[0-9]+$/.test(value)) throw new Error(`${field} must be an unsigned integer string`);
  const parsed = BigInt(value); if (parsed <= 0n) throw new Error(`${field} must be positive`); return parsed;
}
export function fee(amount: bigint, bps = 250n) { return (amount * bps + 9999n) / 10000n; }
export function quote(usdMicros: bigint, priceUsdMicros: bigint, decimals = 9) {
  const scale = 10n ** BigInt(decimals); const tokens = usdMicros * scale / priceUsdMicros;
  if (tokens <= 0n) throw new Error("purchase amount too small");
  const serviceFee = fee(usdMicros); return {tokenBaseUnits:tokens,serviceFeeUsdMicros:serviceFee,totalUsdMicros:usdMicros+serviceFee};
}
