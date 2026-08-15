import {
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
} from "@powerchain/ui";
import {
  checkoutConfig,
} from "../lib/config";

export default function CheckoutHome() {
  const config =
    checkoutConfig();

  return (
    <main className="checkout-page simple-page">
      <Card>
        <CardHeader
          eyebrow="PowerChain"
          title="Secure Checkout"
          description="Start from a PowerChain sale to create a verified checkout session."
        />
        <CardBody>
          <ButtonLink
            href={`${config.launchpadUrl}/sales`}
          >
            Browse token sales
          </ButtonLink>
        </CardBody>
      </Card>
    </main>
  );
}
