import type { CheckoutMethod } from "../types/checkout";
import { checkoutService } from "../services/checkout-service";

export function selectCheckoutMethod(
  value: string,
): CheckoutMethod {
  const method = checkoutService
    .methods()
    .find(item => item.id === value);

  return method?.id ?? checkoutService.defaultMethod();
}
