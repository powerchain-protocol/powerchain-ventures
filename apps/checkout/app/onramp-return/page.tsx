import {
  Badge,
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
  Information,
} from "@powerchain/ui";
import {
  CheckoutShell,
} from "../../components/checkout-shell";
import {
  checkoutConfig,
} from "../../lib/config";

export default async function OnrampReturn({
  searchParams,
}: {
  searchParams:
    Promise<{
      saleId?: string;
    }>;
}) {
  const params =
    await searchParams;
  const config =
    checkoutConfig();

  const purchaseHref =
    params.saleId
      ? `/checkout/${encodeURIComponent(
          params.saleId,
        )}`
      : "/";

  return (
    <CheckoutShell>
      <main className="checkout-page simple-page">
        <Card>
          <CardHeader
            eyebrow="Wallet funding"
            title="Return to PowerChain Checkout"
            description="Coinbase Onramp funds your wallet. PowerChain does not treat an Onramp session as a token purchase."
            action={
              <Badge tone="info">
                Separate settlement
              </Badge>
            }
          />
          <CardBody>
            <Information
              title="Verify your wallet balance"
              compact
            >
              When the SOL arrives, continue to the sale checkout. PowerChain will prepare a new exact transaction for the token purchase and your wallet must review and sign it separately.
            </Information>

            <div className="onramp-return-actions">
              <ButtonLink
                href={purchaseHref}
              >
                Continue to purchase
              </ButtonLink>
              <ButtonLink
                href={`${config.launchpadUrl}/transactions`}
                variant="secondary"
              >
                Transaction Center
              </ButtonLink>
            </div>
          </CardBody>
        </Card>
      </main>
    </CheckoutShell>
  );
}
