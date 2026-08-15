"use client";

import {
  useCallback,
  useState,
} from "react";
import {
  useWallet,
} from "@solana/connector/react";

type SignMessageResult =
  | Uint8Array
  | {
      signature?: Uint8Array;
  };

type SignerLike = {
  signMessage?: (
    message: Uint8Array,
  ) =>
    | Promise<SignMessageResult>
    | SignMessageResult;
};

function toBase64(
  value: Uint8Array,
): string {
  let binary = "";
  for (const byte of value) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function findSigner(
  wallet: unknown,
): SignerLike | null {
  if (
    wallet &&
    typeof wallet === "object"
  ) {
    const candidate =
      wallet as Record<string, unknown>;

    if (
      typeof candidate.signMessage ===
      "function"
    ) {
      return candidate as SignerLike;
    }

    const account =
      candidate.account;
    if (
      account &&
      typeof account === "object" &&
      typeof (
        account as Record<
          string,
          unknown
        >
      ).signMessage === "function"
    ) {
      return account as SignerLike;
    }
  }

  const injected =
    typeof window !== "undefined"
      ? (
          window as unknown as {
            solana?: SignerLike;
          }
        ).solana
      : undefined;

  return injected?.signMessage
    ? injected
    : null;
}

export function useSolanaLogin() {
  const wallet = useWallet();
  const [busy, setBusy] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const signIn =
    useCallback(async () => {
      const address =
        wallet.account
          ? String(wallet.account)
          : "";

      if (!address) {
        throw new Error(
          "Connect a Solana wallet first",
        );
      }

      const signer =
        findSigner(wallet);

      if (!signer?.signMessage) {
        throw new Error(
          "The connected wallet does not expose message signing. Use a wallet with signMessage support.",
        );
      }

      setBusy(true);
      setError(null);

      try {
        const challengeResponse =
          await fetch(
            "/api/v1/auth/wallet/challenge",
            {
              method: "POST",
              headers: {
                "content-type":
                  "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                address,
              }),
            },
          );

        const challenge =
          await challengeResponse.json();

        if (!challengeResponse.ok) {
          throw new Error(
            challenge?.error?.message ??
              "Unable to create wallet sign-in challenge",
          );
        }

        const encoded =
          new TextEncoder().encode(
            challenge.message,
          );

        const signed =
          await signer.signMessage(
            encoded,
          );

        const signature =
          signed instanceof Uint8Array
            ? signed
            : signed?.signature;

        if (
          !(signature instanceof Uint8Array)
        ) {
          throw new Error(
            "Wallet did not return a valid message signature",
          );
        }

        const verifyResponse =
          await fetch(
            "/api/v1/auth/wallet/verify",
            {
              method: "POST",
              headers: {
                "content-type":
                  "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                address,
                message:
                  challenge.message,
                signatureBase64:
                  toBase64(signature),
              }),
            },
          );

        const verified =
          await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(
            verified?.error?.message ??
              "Wallet signature verification failed",
          );
        }

        return verified;
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : "Wallet sign-in failed";
        setError(message);
        throw cause;
      } finally {
        setBusy(false);
      }
    }, [wallet]);

  return {
    signIn,
    busy,
    error,
  };
}
