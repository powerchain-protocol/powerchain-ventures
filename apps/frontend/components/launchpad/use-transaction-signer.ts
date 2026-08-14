"use client";

import { useCallback } from "react";
import { useTransactionSigner } from "@solana/connector";
import { Transaction } from "@solana/web3.js";

function bytesFromBase64(value: string): Uint8Array {
  if (!value || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) throw new Error("Prepared transaction payload is not valid base64");
  try {
    const raw = atob(value);
    const out = new Uint8Array(raw.length);
    for (let index = 0; index < raw.length; index += 1) out[index] = raw.charCodeAt(index);
    return out;
  } catch {
    throw new Error("Prepared transaction payload could not be decoded");
  }
}

/** Signs only a server-prepared serialized Solana transaction after the review step. */
export function useSerializedTransactionSigner() {
  const { signer, ready, address } = useTransactionSigner();

  const signAndSend = useCallback(async (serializedBase64: string) => {
    if (!signer || !ready) throw new Error("Connect a wallet that can sign Solana transactions");

    let transaction: Transaction;
    try {
      transaction = Transaction.from(bytesFromBase64(serializedBase64));
    } catch (cause) {
      throw cause instanceof Error ? cause : new Error("Prepared transaction is invalid");
    }

    const signature = await signer.signAndSendTransaction(transaction);
    const normalized = typeof signature === "string" ? signature : String(signature);
    if (!normalized || normalized === "undefined" || normalized === "null") {
      throw new Error("Wallet did not return a Solana transaction signature");
    }
    return normalized;
  }, [ready, signer]);

  return { signAndSend, ready, address: address ? String(address) : null } as const;
}
