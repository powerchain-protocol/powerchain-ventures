"use client";

import {
  useCallback,
} from "react";
import {
  useTransactionSigner,
} from "@solana/connector";
import {
  Transaction,
} from "@solana/web3.js";

function bytesFromBase64(
  value: string,
) {
  if (
    !value ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(
      value,
    )
  ) {
    throw new Error(
      "Prepared transaction payload is invalid",
    );
  }

  const raw =
    atob(value);
  const bytes =
    new Uint8Array(
      raw.length,
    );

  for (
    let index = 0;
    index < raw.length;
    index += 1
  ) {
    bytes[index] =
      raw.charCodeAt(
        index,
      );
  }

  return bytes;
}

export function useSerializedTransactionSigner() {
  const {
    signer,
    ready,
    address,
  } =
    useTransactionSigner();

  const signAndSend =
    useCallback(
      async (
        serializedBase64:
          string,
      ) => {
        if (
          !signer ||
          !ready
        ) {
          throw new Error(
            "Connect a wallet that can sign Solana transactions",
          );
        }

        const transaction =
          Transaction.from(
            bytesFromBase64(
              serializedBase64,
            ),
          );

        const signature =
          await signer.signAndSendTransaction(
            transaction,
          );

        const out =
          typeof signature ===
          "string"
            ? signature
            : String(
                signature,
              );

        if (
          !out ||
          out ===
            "undefined" ||
          out === "null"
        ) {
          throw new Error(
            "Wallet did not return a transaction signature",
          );
        }

        return out;
      },
      [
        ready,
        signer,
      ],
    );

  return {
    signAndSend,
    ready,
    address:
      address
        ? String(address)
        : null,
  } as const;
}
