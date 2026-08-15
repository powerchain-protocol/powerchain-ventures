import {
  defaultPaymentMethod,
  paymentMethods,
  type PaymentEnvironment,
} from "./payments.js";

export type CheckoutRuntimeConfig = {
  defaultPaymentMethod:
    "sol-pwrc";
  methods:
    ReturnType<
      typeof paymentMethods
    >;
  solanaPayEnabled:
    boolean;
};

export function getCheckoutRuntimeConfig(
  env:
    PaymentEnvironment =
      ((globalThis as typeof globalThis & { process?: { env?: PaymentEnvironment } }).process?.env ?? {}),
): CheckoutRuntimeConfig {
  const methods =
    paymentMethods(env);

  return {
    defaultPaymentMethod:
      defaultPaymentMethod(),
    methods,
    solanaPayEnabled:
      methods.some(
        value =>
          value.id ===
            "solana-pay" &&
          value.enabled,
      ),
  };
}
