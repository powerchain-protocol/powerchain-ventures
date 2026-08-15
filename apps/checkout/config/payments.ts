import {
  getCheckoutRuntimeConfig,
} from "@powerchain/launchpad-config/checkout";

export function checkoutPaymentConfig() {
  return getCheckoutRuntimeConfig(
    {
      NEXT_PUBLIC_SOLANA_PAY_ENABLED:
        process.env
          .NEXT_PUBLIC_SOLANA_PAY_ENABLED,
      NEXT_PUBLIC_COINBASE_ONRAMP_ENABLED:
        process.env
          .NEXT_PUBLIC_COINBASE_ONRAMP_ENABLED,
      NEXT_PUBLIC_STRIPE_ENABLED:
        process.env
          .NEXT_PUBLIC_STRIPE_ENABLED,
      NEXT_PUBLIC_USDC_PURCHASE_ENABLED:
        process.env
          .NEXT_PUBLIC_USDC_PURCHASE_ENABLED,
      NEXT_PUBLIC_CCTP_ENABLED:
        process.env
          .NEXT_PUBLIC_CCTP_ENABLED,
      NEXT_PUBLIC_SUI_PURCHASE_ENABLED:
        process.env
          .NEXT_PUBLIC_SUI_PURCHASE_ENABLED,
      NEXT_PUBLIC_ZK_COMPRESSION_ENABLED:
        process.env
          .NEXT_PUBLIC_ZK_COMPRESSION_ENABLED,
    },
  );
}
