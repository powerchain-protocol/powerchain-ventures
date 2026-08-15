import {
  ButtonLink,
  EmptyState,
} from "@powerchain/ui";
import {
  checkoutConfig,
} from "../lib/config";

export function CheckoutNotFound() {
  const config =
    checkoutConfig();

  return (
    <main className="checkout-page simple-page">
      <EmptyState
        title="Checkout not found"
        description="Return to PowerChain Launchpad and open a valid sale."
        action={
          <ButtonLink
            href={`${config.launchpadUrl}/sales`}
          >
            Browse sales
          </ButtonLink>
        }
      />
    </main>
  );
}
