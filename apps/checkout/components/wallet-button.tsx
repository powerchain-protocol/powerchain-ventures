"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  useConnectWallet,
  useDisconnectWallet,
  useWallet,
  useWalletConnectors,
} from "@solana/connector/react";
import {
  Badge,
  Button,
} from "@powerchain/ui";
import {
  shortAddress,
} from "../lib/formats";
import {
  AssetIcon,
} from "./asset-icon";

export function CheckoutWalletButton() {
  const wallet =
    useWallet();
  const connectors =
    useWalletConnectors();
  const connect =
    useConnectWallet();
  const disconnect =
    useDisconnectWallet();
  const [open, setOpen] =
    useState(false);

  const address =
    wallet.account
      ? String(
          wallet.account,
        )
      : "";

  const options =
    useMemo(
      () =>
        connectors
          .filter(
            connector =>
              connector.ready,
          )
          .sort(
            (a, b) =>
              a.name.localeCompare(
                b.name,
              ),
          ),
      [connectors],
    );

  if (
    wallet.isConnected &&
    address
  ) {
    return (
      <div className="checkout-wallet-control">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setOpen(
              value =>
                !value,
            )
          }
        >
          <AssetIcon
            kind="network"
            id="solana"
            size={18}
          />
          {shortAddress(
            address,
            5,
            5,
          )}
          <Badge
            tone="success"
          >
            Connected
          </Badge>
        </Button>

        {open ? (
          <div className="checkout-wallet-menu">
            <code>
              {address}
            </code>
            <Button
              type="button"
              variant="ghost"
              block
              onClick={() => {
                void navigator
                  .clipboard
                  .writeText(
                    address,
                  );
              }}
            >
              Copy address
            </Button>
            <Button
              type="button"
              variant="ghost"
              block
              onClick={() => {
                disconnect.disconnect();
                setOpen(false);
              }}
            >
              Disconnect
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="checkout-wallet-control">
      <Button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        disabled={
          wallet.isConnecting
        }
      >
        <AssetIcon
          kind="wallet"
          id="phantom"
          size={18}
        />
        {wallet.isConnecting
          ? "Connecting…"
          : "Connect wallet"}
      </Button>

      {open ? (
        <div className="checkout-wallet-dialog">
          <div className="checkout-wallet-dialog-head">
            <div>
              <span className="eyebrow">
                Solana wallet
              </span>
              <h3>
                Connect to Checkout
              </h3>
            </div>
            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <p>
            PowerChain uses Wallet Standard.
            Private keys and recovery phrases
            never leave your wallet.
          </p>

          <div className="checkout-wallet-options">
            {options.length ? (
              options.map(
                connector => (
                  <button
                    key={
                      connector.id
                    }
                    type="button"
                    disabled={
                      connect.isConnecting
                    }
                    onClick={async () => {
                      await connect.connect(
                        connector.id,
                      );
                      setOpen(
                        false,
                      );
                    }}
                  >
                    <span>
                      <AssetIcon
                        kind="wallet"
                        id={
                          connector.name
                        }
                        size={28}
                      />
                      <b>
                        {
                          connector.name
                        }
                      </b>
                    </span>
                    <strong>
                      Connect
                    </strong>
                  </button>
                ),
              )
            ) : (
              <div className="checkout-wallet-empty">
                No Wallet Standard provider
                was detected.
              </div>
            )}
          </div>

          {connect.error ? (
            <div
              className="checkout-error"
              role="alert"
            >
              {
                connect.error
                  .message
              }
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
