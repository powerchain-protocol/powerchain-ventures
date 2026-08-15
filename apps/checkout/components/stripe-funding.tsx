"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Alarm,
  Button,
  Card,
  LoadingState,
} from "@powerchain/ui";
import {
  checkoutService,
} from "../services/checkout-service";

type StripeState = {
  enabled: boolean;
  configured: boolean;
  hostedUrl?: string;
};

export function StripeFunding() {
  const [
    state,
    setState,
  ] =
    useState<StripeState | null>(
      null,
    );

  useEffect(() => {
    let live = true;

    void checkoutService
      .paymentConfig()
      .then(
        config => {
          if (live) {
            setState(
              config.methods
                .stripe,
            );
          }
        },
      )
      .catch(
        () => {
          if (live) {
            setState({
              enabled: false,
              configured: false,
            });
          }
        },
      );

    return () => {
      live = false;
    };
  }, []);

  if (!state) {
    return (
      <LoadingState
        label="Checking Stripe provider…"
      />
    );
  }

  return (
    <Card className="onramp-card">
      <div>
        <span className="eyebrow">
          Optional provider
        </span>
        <h3>
          Stripe hosted funding
        </h3>
      </div>

      <Alarm
        tone={
          state.configured
            ? "info"
            : "warning"
        }
        title={
          state.configured
            ? "Provider-hosted"
            : "Stripe disabled"
        }
      >
        {state.configured
          ? "Stripe opens outside PowerChain. No raw card number, expiry or CVV is collected by this checkout. Provider funding does not itself settle the PWRC purchase."
          : "Enable the reviewed hosted Stripe rail in server and browser payment configuration before exposing this method."}
      </Alarm>

      {state.configured &&
      state.hostedUrl ? (
        <Button
          block
          onClick={() => {
            window.open(
              state.hostedUrl,
              "_blank",
              "noopener,noreferrer",
            );
          }}
        >
          Continue to Stripe
        </Button>
      ) : null}
    </Card>
  );
}
