"use client";

import {
  WalletButton,
} from "../wallet-button";
import {
  SuiWalletButton,
} from "./sui-wallet-button";

export function MultichainWalletControls() {
  return (
    <div className="multichain-wallet-controls">
      <WalletButton />
      <SuiWalletButton />
    </div>
  );
}
