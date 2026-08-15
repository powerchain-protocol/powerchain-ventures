import {
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import {
  assertSolanaAddress,
} from "./tokens.js";

export type SolanaPayTransferRequest = {
  recipient: string;
  amount?: string | number;
  splToken?: string;
  reference?:
    | string
    | readonly string[];
  label?: string;
  message?: string;
  memo?: string;
};

function decimal(
  value:
    | string
    | number,
) {
  const raw =
    String(value).trim();

  if (
    !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(
      raw,
    ) ||
    Number(raw) <= 0
  ) {
    throw new Error(
      "invalid_solana_pay_amount",
    );
  }

  return raw;
}

/**
 * Solana Pay transfer request v1.1 URL.
 * Uses @solana/web3.js for address validation while preserving the
 * protocol's wire format.
 */
export function encodeSolanaPayTransferRequest(
  input:
    SolanaPayTransferRequest,
) {
  const recipient =
    assertSolanaAddress(
      input.recipient,
    );

  const params =
    new URLSearchParams();

  if (
    input.amount !==
    undefined
  ) {
    params.set(
      "amount",
      decimal(
        input.amount,
      ),
    );
  }

  if (input.splToken) {
    params.set(
      "spl-token",
      assertSolanaAddress(
        input.splToken,
      ),
    );
  }

  const references =
    input.reference ===
    undefined
      ? []
      : Array.isArray(
          input.reference,
        )
        ? input.reference
        : [
            input.reference,
          ];

  for (
    const reference
    of references
  ) {
    params.append(
      "reference",
      assertSolanaAddress(
        reference,
      ),
    );
  }

  for (
    const [
      key,
      value,
    ]
    of [
      [
        "label",
        input.label,
      ],
      [
        "message",
        input.message,
      ],
      [
        "memo",
        input.memo,
      ],
    ] as const
  ) {
    if (
      value?.trim()
    ) {
      params.set(
        key,
        value.trim(),
      );
    }
  }

  const query =
    params.toString();

  return new URL(
    `solana:${recipient}${
      query
        ? `?${query}`
        : ""
    }`,
  );
}

/**
 * Transaction-request URLs are `solana:https://...` links.
 * The endpoint itself remains an ordinary HTTPS URL.
 */
export function encodeSolanaPayTransactionRequest(
  endpoint:
    string | URL,
) {
  const value =
    new URL(
      endpoint,
    );

  if (
    value.protocol !==
      "https:" &&
    value.hostname !==
      "localhost"
  ) {
    throw new Error(
      "solana_pay_transaction_request_requires_https",
    );
  }

  return new URL(
    `solana:${value.toString()}`,
  );
}

export function createSolanaPayReference() {
  return Keypair
    .generate()
    .publicKey
    .toBase58();
}

export function parseSolanaPayUrl(
  value: string,
) {
  if (
    !value.startsWith(
      "solana:",
    )
  ) {
    throw new Error(
      "invalid_solana_pay_scheme",
    );
  }

  const payload =
    value.slice(
      "solana:".length,
    );

  if (
    payload.startsWith(
      "https://",
    ) ||
    payload.startsWith(
      "http://localhost",
    )
  ) {
    return {
      kind:
        "transaction-request" as const,
      link:
        new URL(
          payload,
        ),
    };
  }

  const [
    recipient,
    query = "",
  ] =
    payload.split(
      "?",
      2,
    );

  return {
    kind:
      "transfer-request" as const,
    recipient:
      new PublicKey(
        recipient,
      ).toBase58(),
    params:
      new URLSearchParams(
        query,
      ),
  };
}
