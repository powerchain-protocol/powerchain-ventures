import {
  LoadingState,
} from "@powerchain/ui";

export default function Loading() {
  return (
    <main className="checkout-page simple-page">
      <LoadingState
        label="Loading PowerChain Checkout…"
      />
    </main>
  );
}
