export function usdInputToMicros(
  value: string,
): string {
  const raw =
    value.trim();

  if (
    !/^\d+(\.\d{0,6})?$/.test(
      raw,
    )
  ) {
    throw new Error(
      "Enter a valid USD amount",
    );
  }

  const [
    whole,
    fraction = "",
  ] = raw.split(".");

  const micros =
    BigInt(whole) *
      1_000_000n +
    BigInt(
      fraction
        .padEnd(6, "0")
        .slice(0, 6) ||
        "0",
    );

  if (micros <= 0n) {
    throw new Error(
      "Amount must be greater than zero",
    );
  }

  return micros.toString();
}

export function microsToUsdInput(
  value: string,
) {
  const micros =
    BigInt(value);
  const whole =
    micros /
    1_000_000n;
  const fraction =
    (micros %
      1_000_000n)
      .toString()
      .padStart(6, "0")
      .replace(/0+$/, "");

  return fraction
    ? `${whole}.${fraction}`
    : whole.toString();
}
