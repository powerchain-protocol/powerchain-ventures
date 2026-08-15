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
  Badge,
} from "../ui/badge";
import {
  formatAddress,
} from "@powerchain/utils/formats";

export function ReceivePwrc({
  address,
}: {
  address: string;
}) {
  const [copied, setCopied] =
    useState(false);

  async function copy() {
    await navigator.clipboard.writeText(
      address,
    );
    setCopied(true);
    setTimeout(
      () => setCopied(false),
      1_500,
    );
  }

  return (
    <section className="receive-pwrc">
      <header>
        <AssetIcon
          kind="token"
          id="PWRC"
          size={38}
        />
        <div>
          <span className="eyebrow">
            Receive
          </span>
          <h3>Receive PWRC</h3>
        </div>
        <Badge tone="info">
          Solana
        </Badge>
      </header>

      <p>
        Send only Solana PWRC
        Token-2022 assets to this
        wallet. Verify the mint before
        transferring.
      </p>

      <code>
        {formatAddress(
          address,
          12,
          12,
        )}
      </code>

      <Button
        type="button"
        variant="secondary"
        block
        onClick={() => void copy()}
      >
        {copied
          ? "Address copied"
          : "Copy receive address"}
      </Button>
    </section>
  );
}
