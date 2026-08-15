"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  checkoutPaymentConfig,
} from "../config/payments";

export type CheckoutPaymentView =
  | "wallet"
  | "qr"
  | "onramp"
  | "card";

type PaymentContextValue = {
  value:
    CheckoutPaymentView;
  setValue:
    (
      value:
        CheckoutPaymentView,
    ) => void;
  config:
    ReturnType<
      typeof checkoutPaymentConfig
    >;
};

const PaymentContext =
  createContext<
    PaymentContextValue |
    null
  >(null);

export function PaymentProvider({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const config =
    useMemo(
      () =>
        checkoutPaymentConfig(),
      [],
    );

  const [
    value,
    setValue,
  ] =
    useState<CheckoutPaymentView>(
      "wallet",
    );

  return (
    <PaymentContext.Provider
      value={{
        value,
        setValue,
        config,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function useCheckoutPayment() {
  const value =
    useContext(
      PaymentContext,
    );

  if (!value) {
    throw new Error(
      "useCheckoutPayment must be used inside PaymentProvider",
    );
  }

  return value;
}
