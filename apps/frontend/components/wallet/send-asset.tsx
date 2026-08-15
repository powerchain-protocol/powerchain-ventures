"use client";

import {
  useState,
} from "react";
import {
  AssetIcon,
} from "../web3/asset-icon";
import {
  Button,
} from "../ui/button";
import {
  Form,
  FormActions,
} from "../ui/forms";
import {
  FormField,
} from "../ui/form-field";
import {
  Select,
} from "../ui/select";
import {
  Alarm,
} from "../ui/alarms";
import {
  validateWalletAddress,
} from "../../lib/validate";

type SendableAsset =
  | "SOL"
  | "PWRC"
  | "USDC";

export function SendAsset({
  wallet,
}: {
  wallet: string;
}) {
  const [asset, setAsset] =
    useState<SendableAsset>(
      "PWRC",
    );
  const [recipient, setRecipient] =
    useState("");
  const [amount, setAmount] =
    useState("");
  const [busy, setBusy] =
    useState(false);
  const [status, setStatus] =
    useState<string | null>(null);

  async function submit(
    event: React.FormEvent,
  ) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);

    try {
      validateWalletAddress(
        recipient,
      );

      if (
        !/^\d+(\.\d+)?$/.test(
          amount.trim(),
        ) ||
        Number(amount) <= 0
      ) {
        throw new Error(
          "Enter a valid positive amount",
        );
      }

      // The existing wallet center owns exact base-unit conversion
      // and reviewed transaction signing. This component does not
      // bypass that review path.
      setStatus(
        "Transfer details validated. Continue through the reviewed wallet transfer flow.",
      );
    } catch (cause) {
      setStatus(
        cause instanceof Error
          ? cause.message
          : "Unable to validate transfer",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Form
      className="send-asset-form"
      onSubmit={submit}
    >
      <Select
        name="asset"
        label="Asset"
        value={asset}
        onValueChange={setAsset}
        options={[
          {
            value: "PWRC",
            label: "PWRC · Token-2022",
          },
          {
            value: "SOL",
            label: "SOL · Native",
          },
          {
            value: "USDC",
            label: "USDC · Circle native",
          },
        ]}
      />

      <div className="send-asset-summary">
        <AssetIcon
          kind="token"
          id={asset}
          size={32}
        />
        <div>
          <strong>
            Send {asset}
          </strong>
          <small>
            From {wallet.slice(0, 8)}…
          </small>
        </div>
      </div>

      <FormField
        name="recipient"
        label="Recipient"
        value={recipient}
        onChange={event =>
          setRecipient(
            event.target.value,
          )
        }
        placeholder="Solana wallet address"
        autoComplete="off"
        required
      />

      <FormField
        name="amount"
        label="Amount"
        value={amount}
        onChange={event =>
          setAmount(
            event.target.value,
          )
        }
        inputMode="decimal"
        placeholder="0.00"
        required
      />

      {status ? (
        <Alarm
          tone={
            status.startsWith(
              "Transfer details",
            )
              ? "success"
              : "warning"
          }
          title={
            status.startsWith(
              "Transfer details",
            )
              ? "Ready for review"
              : "Check transfer"
          }
        >
          {status}
        </Alarm>
      ) : null}

      <FormActions>
        <Button
          type="submit"
          block
          size="lg"
          disabled={busy}
        >
          {busy
            ? "Validating…"
            : "Review transfer"}
        </Button>
      </FormActions>
    </Form>
  );
}
