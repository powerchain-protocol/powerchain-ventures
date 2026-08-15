export type StripeProviderStatus = {
  enabled: boolean;
  configured: boolean;
  mode:
    | "disabled"
    | "hosted";
  hostedUrl?: string;
};

/**
 * Stripe is intentionally provider-hosted and opt-in. PowerChain never
 * collects raw PAN/CVV/expiry fields.
 */
export function stripeProviderStatus(
  env:
    NodeJS.ProcessEnv =
      process.env,
): StripeProviderStatus {
  const enabled =
    env
      .POWERCHAIN_STRIPE_ENABLED ===
      "1";
  const hostedUrl =
    env
      .STRIPE_HOSTED_CHECKOUT_URL
      ?.trim();

  if (hostedUrl) {
    const parsed =
      new URL(
        hostedUrl,
      );

    if (
      parsed.protocol !==
      "https:"
    ) {
      throw new Error(
        "STRIPE_HOSTED_CHECKOUT_URL must use HTTPS",
      );
    }
  }

  const configured =
    enabled &&
    Boolean(
      hostedUrl,
    );

  return {
    enabled,
    configured,
    mode:
      enabled
        ? "hosted"
        : "disabled",
    ...(configured &&
    hostedUrl
      ? {
          hostedUrl,
        }
      : {}),
  };
}
