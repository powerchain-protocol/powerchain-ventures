"use client";

import {
  Tabs,
} from "@powerchain/ui";
import {
  useCheckoutPayment,
  type CheckoutPaymentView,
} from "../context/payment-context";
import {
  AssetIcon,
} from "./asset-icon";

export type PaymentMethod =
  CheckoutPaymentView;

export function PaymentMethods({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (
    value: PaymentMethod,
  ) => void;
}) {
  const {
    config,
  } =
    useCheckoutPayment();

  const solanaPay =
    config.methods.find(
      method =>
        method.id ===
        "solana-pay",
    );

  const onramp =
    config.methods.find(
      method =>
        method.id ===
        "coinbase-onramp",
    );

  const stripe =
    config.methods.find(
      method =>
        method.id ===
        "stripe",
    );

  return (
    <Tabs
      value={value}
      onChange={onChange}
      ariaLabel="Payment method"
      variant="cards"
      items={[
        {
          value: "wallet",
          label:
            "SOL → PWRC",
          description:
            "Default wallet purchase",
          badge:
            "Default",
        },
        ...(solanaPay?.enabled
          ? [
              {
                value:
                  "qr" as const,
                label:
                  "Solana Pay",
                description:
                  "Scan transaction QR",
                badge:
                  "QR",
              },
            ]
          : []),
        ...(onramp?.enabled
          ? [
              {
                value:
                  "onramp" as const,
                label:
                  "Fund SOL",
                description:
                  "Coinbase hosted onramp",
              },
            ]
          : []),
        {
          value: "card",
          label:
            "Card / Stripe",
          description:
            stripe?.enabled
              ? "Provider-hosted funding"
              : "Disabled by config",
          disabled:
            !stripe?.enabled,
          badge:
            stripe?.enabled
              ? "Optional"
              : "Off",
        },
      ]}
      icons={{
        wallet: (
          <AssetIcon
            kind="network"
            id="solana"
            size={22}
          />
        ),
        qr: (
          <AssetIcon
            kind="network"
            id="solana"
            size={22}
          />
        ),
        onramp: (
          <AssetIcon
            kind="wallet"
            id="coinbase"
            size={22}
          />
        ),
      }}
    />
  );
}
