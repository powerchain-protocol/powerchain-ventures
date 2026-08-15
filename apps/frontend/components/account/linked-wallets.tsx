"use client";

import {
  useState,
} from "react";
import {
  useAccountWallets,
} from "../../hooks/use-account-wallets";
import {
  formatAddress,
  formatDateTime,
} from "@powerchain/utils/formats";
import {
  AssetIcon,
} from "../web3/asset-icon";
import {
  Badge,
} from "../ui/badge";
import {
  Button,
} from "../ui/button";
import {
  Alarm,
} from "../ui/alarms";

export function LinkedWallets() {
  const {
    wallets,
    loading,
    error,
    unlink,
  } = useAccountWallets();

  const [busy, setBusy] =
    useState<string | null>(null);

  if (loading) {
    return (
      <div className="linked-wallets-empty">
        Loading linked wallets…
      </div>
    );
  }

  if (error) {
    return (
      <Alarm
        tone="warning"
        title="Linked wallets unavailable"
      >
        {error}
      </Alarm>
    );
  }

  if (!wallets.length) {
    return (
      <div className="linked-wallets-empty">
        No wallets are linked to this
        account yet.
      </div>
    );
  }

  return (
    <div className="linked-wallets">
      {wallets.map(wallet => (
        <article
          key={`${wallet.chain}:${wallet.address}`}
          className="linked-wallet-row"
        >
          <AssetIcon
            kind="network"
            id={wallet.chain}
            size={28}
          />

          <div className="linked-wallet-copy">
            <div>
              <strong>
                {wallet.chain === "solana"
                  ? "Solana wallet"
                  : "Sui wallet"}
              </strong>
              <Badge tone="neutral">
                {wallet.provider}
              </Badge>
            </div>

            <code>
              {formatAddress(
                wallet.address,
                9,
                9,
              )}
            </code>

            {wallet.lastAuthenticatedAt ? (
              <small>
                Last authenticated{" "}
                {formatDateTime(
                  wallet.lastAuthenticatedAt,
                )}
              </small>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={
              busy === wallet.address
            }
            onClick={async () => {
              setBusy(
                wallet.address,
              );
              try {
                await unlink(
                  wallet.chain,
                  wallet.address,
                );
              } finally {
                setBusy(null);
              }
            }}
          >
            {busy === wallet.address
              ? "Removing…"
              : "Unlink"}
          </Button>
        </article>
      ))}
    </div>
  );
}
