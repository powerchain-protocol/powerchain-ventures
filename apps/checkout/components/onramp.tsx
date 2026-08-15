"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useWallet,
} from "@solana/connector/react";
import {
  Alarm,
  Badge,
  Button,
  Card,
  FormField,
} from "@powerchain/ui";
import {
  postJson,
  getJson,
} from "../lib/api";
import {
  AssetIcon,
} from "./asset-icon";

type Status = {
  enabled: boolean;
  configured: boolean;
};

export function Onramp({
  saleId,
}: {
  saleId: string;
}) {
  const wallet =
    useWallet();
  const address =
    wallet.account
      ? String(
          wallet.account,
        )
      : "";

  const [status, setStatus] =
    useState<Status | null>(
      null,
    );
  const [amount, setAmount] =
    useState("100");
  const [busy, setBusy] =
    useState(false);
  const [error, setError] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    let live = true;

    void getJson<Status>(
      "/api/v1/onramp/status",
    )
      .then(value => {
        if (live) {
          setStatus(value);
        }
      })
      .catch(() => {
        if (live) {
          setStatus({
            enabled: false,
            configured: false,
          });
        }
      });

    return () => {
      live = false;
    };
  }, []);

  const valid =
    useMemo(
      () =>
        /^\d+(\.\d{0,2})?$/.test(
          amount,
        ) &&
        Number(amount) >= 5,
      [amount],
    );

  async function start() {
    if (
      !address ||
      !valid ||
      !status?.configured
    ) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const result =
        await postJson<
          {
            onrampUrl: string;
          },
          {
            wallet: string;
            saleId: string;
            paymentAmount: string;
          }
        >(
          "/api/v1/onramp/session",
          {
            wallet:
              address,
            saleId,
            paymentAmount:
              Number(
                amount,
              ).toFixed(2),
          },
          {
            idempotencyKey:
              crypto.randomUUID(),
          },
        );

      const opened =
        window.open(
          result.onrampUrl,
          "_blank",
          "noopener,noreferrer",
        );

      if (!opened) {
        window.location.assign(
          result.onrampUrl,
        );
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to start Onramp",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="onramp-card">
      <div className="onramp-heading">
        <AssetIcon
          kind="wallet"
          id="coinbase"
          size={34}
        />
        <div>
          <span className="eyebrow">
            Hosted funding
          </span>
          <h3>
            Fund your Solana wallet
          </h3>
        </div>
        <Badge
          tone={
            status?.configured
              ? "success"
              : "warning"
          }
        >
          {status === null
            ? "Checking"
            : status.configured
              ? "Ready"
              : "Setup required"}
        </Badge>
      </div>

      <p>
        Coinbase Onramp funds SOL
        directly to your connected
        wallet. The actual token
        purchase remains a separate
        PowerChain-reviewed Solana
        transaction.
      </p>

      <FormField
        name="onrampAmount"
        label="Funding amount (USD)"
        inputMode="decimal"
        value={amount}
        onChange={event =>
          setAmount(
            event.target.value,
          )
        }
        hint="Provider availability, rate and fees are confirmed by Coinbase."
      />

      {!address ? (
        <Alarm
          tone="warning"
          title="Connect wallet"
        >
          Connect the Solana wallet
          that should receive the SOL.
        </Alarm>
      ) : null}

      {error ? (
        <Alarm
          tone="danger"
          title="Funding unavailable"
        >
          {error}
        </Alarm>
      ) : null}

      <Button
        type="button"
        block
        disabled={
          busy ||
          !address ||
          !valid ||
          !status?.configured
        }
        onClick={() =>
          void start()
        }
      >
        {busy
          ? "Preparing…"
          : "Continue with Coinbase"}
      </Button>
    </Card>
  );
}
