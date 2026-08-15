"use client";

import {
  useState,
} from "react";
import {
  useWallet,
} from "@solana/connector/react";
import {
  Button,
} from "../ui/button";
import {
  Tabs,
  TabPanel,
} from "../ui/tabs";
import {
  ReceivePwrc,
} from "./receive-pwrc";
import {
  SendAsset,
} from "./send-asset";

type WalletActionTab =
  | "send"
  | "receive";

export function WalletActions() {
  const wallet = useWallet();
  const [tab, setTab] =
    useState<WalletActionTab>(
      "send",
    );

  const address =
    wallet.account
      ? String(wallet.account)
      : "";

  if (!address) {
    return (
      <div className="wallet-actions-empty">
        Connect a Solana wallet to send or receive assets.
      </div>
    );
  }

  return (
    <section className="wallet-actions-panel">
      <Tabs
        value={tab}
        onChange={setTab}
        ariaLabel="Wallet actions"
        items={[
          {
            value: "send",
            label: "Send",
            description:
              "Reviewed wallet transfer",
          },
          {
            value: "receive",
            label: "Receive",
            description:
              "Copy wallet address",
          },
        ]}
      />

      {tab === "send" ? (
        <TabPanel value="send">
          <SendAsset
            wallet={address}
          />
        </TabPanel>
      ) : null}

      {tab === "receive" ? (
        <TabPanel value="receive">
          <ReceivePwrc
            address={address}
          />
        </TabPanel>
      ) : null}
    </section>
  );
}
