"use client";

import {
  Button,
  ErrorState,
} from "@powerchain/ui";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="checkout-page simple-page">
      <ErrorState
        title="Checkout error"
        description={
          error.message
        }
        action={
          <Button
            type="button"
            onClick={reset}
          >
            Try again
          </Button>
        }
      />
    </main>
  );
}
