"use client";

import {
  NetworkIcon,
  TokenIcon,
  WalletIcon,
} from "@web3icons/react/dynamic";
import {
  PowerChainMark,
} from "../logo";

export function AssetIcon({
  kind,
  id,
  size = 24,
}: {
  kind:
    | "token"
    | "network"
    | "wallet";
  id: string;
  size?: number;
}) {
  const normalized =
    id.trim().toLowerCase();

  if (
    kind === "token" &&
    normalized === "pwrc"
  ) {
    return (
      <PowerChainMark
        size={size}
        className="web3-icon"
      />
    );
  }

  if (kind === "token") {
    return (
      <TokenIcon
        symbol={normalized}
        size={size}
        variant="branded"
      />
    );
  }

  if (kind === "network") {
    return (
      <NetworkIcon
        network={normalized}
        size={size}
        variant="branded"
      />
    );
  }

  return (
    <WalletIcon
      name={normalized}
      size={size}
      variant="branded"
    />
  );
}
