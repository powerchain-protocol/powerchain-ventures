import type {
  CheckoutMethod,
  CheckoutMethodDefinition,
} from "../types/checkout";
import { CHECKOUT_METHODS } from "../types/checkout";

export const checkoutService = {
  methods(): readonly CheckoutMethodDefinition[] {
    return CHECKOUT_METHODS;
  },

  defaultMethod(): CheckoutMethod {
    return "wallet";
  },

  isReady(method: CheckoutMethod): boolean {
    return method === "wallet";
  },
};
