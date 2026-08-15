const SOLANA =
  /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const SUI =
  /^0x[0-9a-fA-F]{64}$/;

const EMAIL =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isSolanaAddress(
  value: string,
) {
  return SOLANA.test(
    value.trim(),
  );
}

export function isSuiAddress(
  value: string,
) {
  return SUI.test(
    value.trim(),
  );
}

export function validateWalletAddress(
  value: string,
) {
  const out = value.trim();
  if (!isSolanaAddress(out)) {
    throw new Error(
      "Invalid Solana wallet address",
    );
  }
  return out;
}

export function validateSuiAddress(
  value: string,
) {
  const out =
    value.trim().toLowerCase();
  if (!isSuiAddress(out)) {
    throw new Error(
      "Invalid Sui wallet address",
    );
  }
  return out;
}

export function validateEmailAddress(
  value: string,
) {
  const out =
    value.trim().toLowerCase();
  if (
    out.length > 254 ||
    !EMAIL.test(out)
  ) {
    throw new Error(
      "Enter a valid email address",
    );
  }
  return out;
}

export function validateUsdMicros(
  value: string,
) {
  if (
    !/^[1-9][0-9]*$/.test(
      value,
    )
  ) {
    throw new Error(
      "Amount must be a positive integer in USD micros",
    );
  }
  return BigInt(value);
}

export function validateBaseUnits(
  value: string,
  field = "amount",
) {
  const out = value.trim();
  if (
    !/^[1-9][0-9]*$/.test(
      out,
    )
  ) {
    throw new Error(
      `${field} must be a positive integer`,
    );
  }
  return BigInt(out);
}

export function validateSignature(
  value: string,
) {
  const out = value.trim();
  if (
    !/^[1-9A-HJ-NP-Za-km-z]{80,100}$/.test(
      out,
    )
  ) {
    throw new Error(
      "Invalid Solana transaction signature",
    );
  }
  return out;
}

export function validateMessageSignatureBase64(
  value: string,
) {
  const out = value.trim();
  let bytes: Uint8Array;

  try {
    const binary =
      atob(out);
    bytes =
      Uint8Array.from(
        binary,
        character =>
          character.charCodeAt(0),
      );
  } catch {
    throw new Error(
      "Invalid wallet message signature",
    );
  }

  if (bytes.length !== 64) {
    throw new Error(
      "Wallet message signature must be 64 bytes",
    );
  }

  return out;
}
