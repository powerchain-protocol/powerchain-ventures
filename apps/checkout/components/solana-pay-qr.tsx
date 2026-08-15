"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import QRCode from "qrcode";
import {
  encodeSolanaPayTransactionRequest,
} from "@powerchain/solana/pay";
import {
  Alarm,
  Button,
  Card,
  Information,
} from "@powerchain/ui";
import {
  checkoutConfig,
} from "../lib/config";
import {
  checkoutService,
} from "../services/checkout-service";
import {
  CHECKOUT_SOLANA_PAY_POLL_MS,
  CHECKOUT_SOLANA_PAY_TIMEOUT_MS,
} from "../constants";

export function SolanaPayQr({
  reviewId,
  onSignature,
  onBack,
}: {
  reviewId: string;
  onSignature:
    (
      signature: string,
    ) => void;
  onBack:
    () => void;
}) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );
  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const url =
    useMemo(
      () => {
        const base =
          checkoutConfig()
            .checkoutUrl
            .replace(
              /\/$/,
              "",
            );

        return encodeSolanaPayTransactionRequest(
          `${base}/api/v1/payments/solana-pay/transaction?reviewId=${encodeURIComponent(
            reviewId,
          )}`,
        ).toString();
      },
      [
        reviewId,
      ],
    );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    void QRCode.toCanvas(
      canvasRef.current,
      url,
      {
        width: 296,
        margin: 2,
        errorCorrectionLevel:
          "M",
      },
    ).catch(
      cause => {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to generate QR code",
        );
      },
    );
  }, [
    url,
  ]);

  useEffect(() => {
    let live = true;
    const started =
      Date.now();

    const timer =
      window.setInterval(
        async () => {
          if (
            !live ||
            Date.now() -
              started >
              CHECKOUT_SOLANA_PAY_TIMEOUT_MS
          ) {
            window.clearInterval(
              timer,
            );
            if (live) {
              setError(
                "QR request timed out. Prepare a fresh transaction before trying again.",
              );
            }
            return;
          }

          try {
            const result =
              await checkoutService.solanaPayStatus(
                reviewId,
              );

            if (
              live &&
              result.found &&
              result.signature
            ) {
              window.clearInterval(
                timer,
              );
              onSignature(
                result.signature,
              );
            }
          } catch {
            // Not finding a signature yet is not a failed payment.
          }
        },
        CHECKOUT_SOLANA_PAY_POLL_MS,
      );

    return () => {
      live = false;
      window.clearInterval(
        timer,
      );
    };
  }, [
    reviewId,
    onSignature,
  ]);

  return (
    <Card className="solana-pay-card">
      <div className="solana-pay-heading">
        <div>
          <span className="eyebrow">
            Solana Pay
          </span>
          <h2>
            Scan to buy PWRC
          </h2>
          <p>
            The QR opens the exact
            prepared SOL → PWRC
            transaction request. The
            wallet account must match
            the prepared buyer.
          </p>
        </div>
      </div>

      {error ? (
        <Alarm
          tone="warning"
          title="QR status"
        >
          {error}
        </Alarm>
      ) : null}

      <div
        className="solana-pay-qr"
        role="img"
        aria-label="Solana Pay QR code for the prepared PowerChain purchase"
      >
        <canvas
          ref={canvasRef}
        />
      </div>

      <Information
        title="No duplicate submission"
        compact
      >
        PowerChain only observes the
        signed transaction produced by
        this prepared review. Polling
        never signs or resubmits it.
      </Information>

      <details className="solana-pay-url">
        <summary>
          Payment URL
        </summary>
        <code>
          {url}
        </code>
      </details>

      <Button
        variant="secondary"
        onClick={onBack}
      >
        Back
      </Button>
    </Card>
  );
}
