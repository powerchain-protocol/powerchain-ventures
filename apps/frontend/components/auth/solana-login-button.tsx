"use client";

import {
  useWallet,
} from "@solana/connector/react";
import {
  useSolanaLogin,
} from "../../hooks/use-solana-login";
import {
  useAuth,
} from "../../context/auth-context";
import {
  AssetIcon,
} from "../web3/asset-icon";
import {
  Button,
} from "../ui/button";

export function SolanaLoginButton() {
  const wallet = useWallet();
  const login = useSolanaLogin();
  const { refresh } = useAuth();

  const connected =
    Boolean(wallet.account);

  return (
    <Button
      type="button"
      variant="secondary"
      block
      disabled={!connected || login.busy}
      onClick={async () => {
        await login.signIn();
        await refresh();
      }}
    >
      <AssetIcon
        kind="network"
        id="solana"
        size={20}
      />
      {login.busy
        ? "Waiting for signature…"
        : connected
          ? "Sign in with Solana"
          : "Connect Solana wallet to sign in"}
    </Button>
  );
}
