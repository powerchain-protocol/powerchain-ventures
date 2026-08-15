import {
  Badge,
  ButtonLink,
  Card,
} from "@powerchain/ui";
import {
  checkoutConfig,
} from "../lib/config";
import {
  shortAddress,
} from "../lib/formats";
import type {
  PurchaseReceipt,
} from "../types/checkout";

export function PurchaseSuccess({
  receipt,
}: {
  receipt:
    PurchaseReceipt;
}) {
  const config =
    checkoutConfig();

  return (
    <section className="purchase-success">
      <div className="purchase-success-mark">
        ✓
      </div>
      <Badge
        tone="success"
        dot
      >
        Settlement verified
      </Badge>
      <h2>
        Purchase successful
      </h2>
      <p>
        PowerChain verified the
        signed Solana transaction,
        payment routing and the
        on-chain purchase state.
      </p>

      <Card className="purchase-receipt">
        <div>
          <span>
            Transaction
          </span>
          <a
            href={`https://explorer.solana.com/tx/${encodeURIComponent(
              receipt.signature,
            )}${receipt.cluster === "devnet" ? "?cluster=devnet" : ""}`}
            target="_blank"
            rel="noreferrer"
          >
            {shortAddress(
              receipt.signature,
              10,
              10,
            )}{" "}
            ↗
          </a>
        </div>
        <div>
          <span>Wallet</span>
          <code>
            {shortAddress(
              receipt.wallet,
              10,
              10,
            )}
          </code>
        </div>
        <div>
          <span>
            Completed
          </span>
          <strong>
            {new Date(
              receipt.settledAt,
            ).toLocaleString()}
          </strong>
        </div>
      </Card>

      <div className="purchase-success-actions">
        <ButtonLink
          href={`${config.launchpadUrl}/transactions`}
        >
          Open Transaction Center
        </ButtonLink>
        <ButtonLink
          href={`${config.launchpadUrl}/sales/${receipt.saleId}`}
          variant="secondary"
        >
          Back to sale
        </ButtonLink>
      </div>
    </section>
  );
}
