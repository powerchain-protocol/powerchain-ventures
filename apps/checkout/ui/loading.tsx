import {
  LoadingState,
} from "@powerchain/ui";

export function CheckoutLoading({
  label =
    "Loading PowerChain Checkout…",
}: {
  label?: string;
}) {
  return (
    <LoadingState
      label={label}
    />
  );
}
