import {
  Badge,
} from "@powerchain/ui";
import {
  checkoutConfig,
} from "../lib/config";
import {
  AssetIcon,
} from "./asset-icon";

export function CheckoutShell({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const config =
    checkoutConfig();

  return (
    <>
      <header className="checkout-header">
        <a
          href={
            config.launchpadUrl
          }
          className="checkout-brand"
        >
          <span className="checkout-brand-mark">
            P
          </span>
          <span>
            <b>
              PowerChain
            </b>
            <small>
              Secure Checkout
            </small>
          </span>
        </a>

        <div className="checkout-header-meta">
          <Badge
            tone="neutral"
          >
            RC.1
          </Badge>
          <span>
            <AssetIcon
              kind="network"
              id="solana"
              size={18}
            />
            {config.solanaCluster ===
            "mainnet-beta"
              ? "Mainnet-beta"
              : "Devnet"}
          </span>
        </div>
      </header>

      {children}

      <footer className="checkout-footer">
        <span>
          PowerChain Checkout™
        </span>
        <span>
          Non-custodial · Review
          before sign · On-chain
          verification
        </span>
      </footer>
    </>
  );
}
