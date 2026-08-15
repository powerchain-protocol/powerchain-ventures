export const USD_MICROS = 1_000_000n;
export const LAMPORTS_PER_SOL = 1_000_000_000n;

export function positiveBigInt(
  value: string | bigint,
  field = "amount",
): bigint {
  const out =
    typeof value === "bigint"
      ? value
      : /^\d+$/.test(value)
        ? BigInt(value)
        : 0n;

  if (out <= 0n) {
    throw new Error(`${field}_must_be_positive`);
  }

  return out;
}

export function decimalToScaledBigInt(
  value: number | string,
  scale: bigint,
): bigint {
  const raw = String(value).trim();

  if (!/^\d+(\.\d+)?$/.test(raw)) {
    throw new Error("invalid_decimal_value");
  }

  const [whole, fraction = ""] = raw.split(".");
  const decimals = scale.toString().length - 1;
  const padded =
    fraction.slice(0, decimals).padEnd(decimals, "0");

  return (
    BigInt(whole) * scale +
    BigInt(padded || "0")
  );
}

export function priceUsdToMicros(
  priceUsd: number | string,
): bigint {
  const value = decimalToScaledBigInt(
    priceUsd,
    USD_MICROS,
  );

  if (value <= 0n) {
    throw new Error("price_usd_must_be_positive");
  }

  return value;
}

export function ceilDiv(
  numerator: bigint,
  denominator: bigint,
): bigint {
  if (numerator < 0n || denominator <= 0n) {
    throw new Error("invalid_division");
  }
  return (
    numerator + denominator - 1n
  ) / denominator;
}

export function usdMicrosToLamports(
  usdMicros: string | bigint,
  solUsdMicros: string | bigint,
): bigint {
  const usd =
    positiveBigInt(usdMicros, "usdMicros");
  const solPrice =
    positiveBigInt(
      solUsdMicros,
      "solUsdMicros",
    );

  return ceilDiv(
    usd * LAMPORTS_PER_SOL,
    solPrice,
  );
}

export function baseUnitsToUiString(
  baseUnits: string | bigint,
  decimals: number,
): string {
  if (
    !Number.isInteger(decimals) ||
    decimals < 0 ||
    decimals > 18
  ) {
    throw new Error("invalid_decimals");
  }

  const units =
    typeof baseUnits === "bigint"
      ? baseUnits
      : BigInt(baseUnits);

  const sign = units < 0n ? "-" : "";
  const abs = units < 0n ? -units : units;

  if (decimals === 0) {
    return `${sign}${abs}`;
  }

  const scale = 10n ** BigInt(decimals);
  const whole = abs / scale;
  const fraction =
    (abs % scale)
      .toString()
      .padStart(decimals, "0")
      .replace(/0+$/, "");

  return fraction
    ? `${sign}${whole}.${fraction}`
    : `${sign}${whole}`;
}
