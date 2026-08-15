"use client";

import {
  NetworkIcon,
  TokenIcon,
  WalletIcon,
} from "@web3icons/react/dynamic";

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
    id.toLowerCase();

  if (
    kind === "token" &&
    normalized === "pwrc"
  ) {
    return (
      <span
        className="pwrc-icon"
        style={{
          width: size,
          height: size,
        }}
        aria-label="PWRC"
      >
        P
      </span>
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

  if (
    kind === "network"
  ) {
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
