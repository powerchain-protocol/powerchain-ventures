"use client";

import {
  Tabs,
} from "@powerchain/ui";
import {
  AssetIcon,
} from "./asset-icon";

export type PaymentMethod =
  | "wallet"
  | "onramp"
  | "card";

export function PaymentMethods({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (
    value: PaymentMethod,
  ) => void;
}) {
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
            "Solana wallet",
          description:
            "Purchase directly with SOL",
          badge: "Primary",
        },
        {
          value: "onramp",
          label:
            "Fund wallet",
          description:
            "Coinbase-hosted SOL funding",
        },
        {
          value: "card",
          label:
            "Card",
          description:
            "Provider-hosted only",
          disabled: true,
          badge:
            "Provider required",
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
