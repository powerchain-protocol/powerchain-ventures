"use client";

import type {
  ReactNode,
} from "react";
import {
  DAppKitProvider,
} from "@mysten/dapp-kit-react";
import {
  suiDAppKit,
} from "../lib/sui-dapp-kit";

export function SuiWalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DAppKitProvider
      dAppKit={suiDAppKit}
    >
      {children}
    </DAppKitProvider>
  );
}
