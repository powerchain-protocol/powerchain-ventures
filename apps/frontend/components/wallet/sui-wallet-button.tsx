"use client";

import {
  useCurrentAccount,
  useCurrentNetwork,
  useCurrentWallet,
} from "@mysten/dapp-kit-react";
import {
  ConnectButton,
} from "@mysten/dapp-kit-react/ui";
import {
  AssetIcon,
} from "../web3/asset-icon";
import {
  Badge,
} from "../ui/badge";
import {
  formatAddress,
} from "@powerchain/utils/formats";

export function SuiWalletButton() {
  const account =
    useCurrentAccount();
  const wallet =
    useCurrentWallet();
  const network =
    useCurrentNetwork();

  return (
    <div className="sui-wallet-control">
      {account ? (
        <div className="sui-wallet-connected">
          <AssetIcon
            kind="network"
            id="sui"
            size={20}
          />
          <span>
            <b>
              {wallet?.name ??
                "Sui Wallet"}
            </b>
            <small>
              {formatAddress(
                account.address,
              )}
            </small>
          </span>
          <Badge
            tone={
              network === "mainnet"
                ? "success"
                : "neutral"
            }
          >
            {network}
          </Badge>
        </div>
      ) : null}

      <ConnectButton />
    </div>
  );
}
