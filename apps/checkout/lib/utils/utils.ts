export function cn(
  ...values:
    Array<
      string |
      false |
      null |
      undefined
    >
) {
  return values
    .filter(Boolean)
    .join(" ");
}

export function shortAddress(
  value: string,
  head = 4,
  tail = 4,
) {
  if (
    value.length <=
    head + tail + 1
  ) {
    return value;
  }

  return `${value.slice(
    0,
    head,
  )}…${value.slice(
    -tail,
  )}`;
}

export async function copyText(
  value: string,
) {
  await navigator.clipboard.writeText(
    value,
  );
}
