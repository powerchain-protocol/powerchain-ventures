export function usdFromMicros(
  value: string,
) {
  const micros =
    BigInt(value);
  return (
    Number(micros) /
    1_000_000
  );
}

export function tokenFromBaseUnits(
  value: string,
  decimals: number,
) {
  const base =
    BigInt(value);
  const scale =
    10n **
    BigInt(decimals);
  const whole =
    base / scale;
  const fraction =
    (base % scale)
      .toString()
      .padStart(
        decimals,
        "0",
      )
      .replace(
        /0+$/,
        "",
      );

  return fraction
    ? `${whole}.${fraction}`
    : whole.toString();
}

export function solFromLamports(
  value: string,
) {
  const lamports =
    BigInt(value);
  const whole =
    lamports /
    1_000_000_000n;
  const fraction =
    (
      lamports %
      1_000_000_000n
    )
      .toString()
      .padStart(
        9,
        "0",
      )
      .replace(
        /0+$/,
        "",
      );

  return fraction
    ? `${whole}.${fraction}`
    : whole.toString();
}

export function shortAddress(
  value: string,
  head = 7,
  tail = 7,
) {
  return value.length >
    head + tail + 1
    ? `${value.slice(
        0,
        head,
      )}…${value.slice(
        -tail,
      )}`
    : value;
}
