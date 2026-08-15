"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useWallet,
} from "@solana/connector/react";
import {
  Alarm,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Form,
  FormActions,
  FormField,
  Information,
  Invoice,
  LoadingState,
  TabPanel,
} from "@powerchain/ui";
import {
  checkoutService,
  type CheckoutSession,
} from "../services/checkout-service";
import {
  microsToUsdInput,
  usdInputToMicros,
} from "../lib/amount";
import {
  tokenFromBaseUnits,
  usdFromMicros,
} from "../lib/formats";
import type {
  PreparedPurchase,
  PurchaseReceipt,
  Sale,
} from "../types/checkout";
import {
  useSerializedTransactionSigner,
} from "../hooks/use-serialized-transaction-signer";
import {
  TransactionReview,
} from "./transaction-review";
import {
  CheckoutWalletButton,
} from "./wallet-button";
import {
  PaymentMethods,
  type PaymentMethod,
} from "./payment-methods";
import {
  Onramp,
} from "./onramp";
import {
  PurchaseSuccess,
} from "./purchase-success";
import {
  AssetIcon,
} from "./asset-icon";

type Stage =
  | "loading"
  | "recovering"
  | "amount"
  | "review"
  | "submitting"
  | "success"
  | "error";

function sleep(ms: number) {
  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms,
      ),
  );
}

type PendingPurchase = {
  saleId: string;
  wallet: string;
  reviewId: string;
  signature: string;
  settlementId?: string;
  savedAt: string;
};

const PENDING_KEY =
  "powerchain.checkout.pending-purchase.v1";

function readPendingPurchase():
  PendingPurchase | null {
  try {
    const raw =
      localStorage.getItem(
        PENDING_KEY,
      );
    if (!raw) return null;

    const value =
      JSON.parse(
        raw,
      ) as PendingPurchase;

    if (
      !value.saleId ||
      !value.wallet ||
      !value.reviewId ||
      !value.signature
    ) {
      return null;
    }

    return value;
  } catch {
    return null;
  }
}

function savePendingPurchase(
  value: PendingPurchase,
) {
  localStorage.setItem(
    PENDING_KEY,
    JSON.stringify(value),
  );
}

function clearPendingPurchase() {
  localStorage.removeItem(
    PENDING_KEY,
  );
}

function updatePendingSettlement(
  settlementId: string,
) {
  const pending =
    readPendingPurchase();

  if (!pending) return;

  savePendingPurchase({
    ...pending,
    settlementId,
  });
}

export function PurchaseFlow({
  saleId,
}: {
  saleId: string;
}) {
  const wallet =
    useWallet();
  const signer =
    useSerializedTransactionSigner();

  const address =
    wallet.account
      ? String(
          wallet.account,
        )
      : "";

  const [sale, setSale] =
    useState<Sale | null>(
      null,
    );
  const [
    marketPrice,
    setMarketPrice,
  ] =
    useState<{
      priceUsd: number | null;
      sourceCount: number;
      maxDivergenceBps:
        number | null;
      stale: boolean;
      sources: Array<{
        provider: string;
        priceUsd: number;
      }>;
    } | null>(null);

  const [stage, setStage] =
    useState<Stage>(
      "loading",
    );
  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      "wallet",
    );
  const [amount, setAmount] =
    useState("");
  const [
    prepared,
    setPrepared,
  ] =
    useState<PreparedPurchase | null>(
      null,
    );
  const [
    checkoutSession,
    setCheckoutSession,
  ] =
    useState<CheckoutSession | null>(
      null,
    );
  const [
    receipt,
    setReceipt,
  ] =
    useState<PurchaseReceipt | null>(
      null,
    );
  const [error, setError] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    let live = true;

    async function load() {
      setStage("loading");
      setError(null);

      try {
        const [
          loadedSale,
          market,
        ] =
          await Promise.all([
            checkoutService.sale(
              saleId,
            ),
            checkoutService
              .marketPrice()
              .catch(
                () => null,
              ),
          ]);

        if (!live) return;

        setSale(
          loadedSale,
        );

        setAmount(
          microsToUsdInput(
            loadedSale
              .min_purchase_usd_micros,
          ),
        );

        if (
          market?.price
        ) {
          setMarketPrice(
            market.price,
          );
        }

        setStage(
          "amount",
        );
      } catch (cause) {
        if (!live) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to load sale",
        );
        setStage(
          "error",
        );
      }
    }

    void load();

    return () => {
      live = false;
    };
  }, [saleId]);

  useEffect(() => {
    if (
      !sale ||
      !address ||
      stage !== "amount"
    ) {
      return;
    }

    const pending =
      readPendingPurchase();

    if (
      !pending ||
      pending.saleId !==
        sale.id ||
      pending.wallet !==
        address
    ) {
      return;
    }

    let live = true;

    async function recoverPendingConfirmation() {
      setStage(
        "recovering",
      );
      setError(null);

      try {
        let settlementId =
          pending!.settlementId;
        let slot:
          number | undefined;

        if (!settlementId) {
          const result =
            await checkoutService.confirm(
              {
                saleId:
                  pending!.saleId,
                wallet:
                  pending!.wallet,
                reviewId:
                  pending!.reviewId,
                signature:
                  pending!.signature,
              },
            );

          settlementId =
            result.settlementId;
          slot =
            result.slot;

          if (settlementId) {
            updatePendingSettlement(
              settlementId,
            );
          }

          if (
            result.status ===
              "failed"
          ) {
            throw new Error(
              "Solana transaction failed",
            );
          }
        }

        if (!settlementId) {
          throw new Error(
            "Signed purchase is still awaiting verified confirmation. PowerChain will not resubmit it automatically.",
          );
        }

        const finality =
          await waitForReconciledSettlement(
            settlementId,
          );

        if (!live) return;

        setReceipt({
          saleId:
            pending!.saleId,
          reviewId:
            pending!.reviewId,
          signature:
            pending!.signature,
          wallet:
            pending!.wallet,
          cluster:
            process.env
              .NEXT_PUBLIC_SOLANA_CLUSTER ===
            "devnet"
              ? "devnet"
              : "mainnet-beta",
          settledAt:
            finality.reconciledAt ??
            new Date().toISOString(),
          slot,
        });

        clearPendingPurchase();
        setStage(
          "success",
        );
      } catch (cause) {
        if (!live) return;

        setStage(
          "amount",
        );
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to recover pending purchase confirmation",
        );
      }
    }

    void recoverPendingConfirmation();

    return () => {
      live = false;
    };
  }, [
    sale,
    address,
    stage,
  ]);

  const orderSummary =
    useMemo(() => {
      let principal = 0;

      if (prepared) {
        principal =
          usdFromMicros(
            prepared.quote
              .usdMicros,
          );
      } else if (
        /^\d+(\.\d{0,6})?$/.test(
          amount.trim(),
        )
      ) {
        principal =
          Number(
            amount,
          );
      }

      const fee =
        prepared
          ? usdFromMicros(
              prepared.quote
                .serviceFeeUsdMicros,
            )
          : principal *
            0.025;

      return {
        principal,
        fee,
        total:
          principal + fee,
        exact:
          Boolean(prepared),
      };
    }, [
      amount,
      prepared,
    ]);

  const saleOpen =
    useMemo(() => {
      if (!sale) return false;
      const now =
        Date.now();
      const start =
        Date.parse(
          sale.starts_at,
        );
      const end =
        Date.parse(
          sale.ends_at,
        );

      return (
        (
          sale.phase ===
            "public" ||
          sale.phase ===
            "private"
        ) &&
        Number.isFinite(
          start,
        ) &&
        Number.isFinite(
          end,
        ) &&
        now >= start &&
        now < end
      );
    }, [sale]);

  async function prepare() {
    if (
      !sale ||
      !address
    ) {
      setError(
        "Connect the Solana wallet that will make the purchase.",
      );
      return;
    }

    setError(null);

    try {
      const usdMicros =
        usdInputToMicros(
          amount,
        );

      const session =
        await checkoutService.createSession(
          {
            saleId:
              sale.id,
            wallet:
              address,
            usdMicros,
          },
        );

      const quote =
        await checkoutService.quote(
          {
            saleId:
              sale.id,
            wallet:
              address,
            usdMicros,
          },
        );

      const result =
        await checkoutService.prepare(
          {
            saleId:
              sale.id,
            wallet:
              address,
            usdMicros,
          },
          session.idempotencyKey,
        );

      if (
        quote.tokenBaseUnits !==
          result.quote
            .tokenBaseUnits ||
        quote.totalUsdMicros !==
          result.quote
            .totalUsdMicros
      ) {
        throw new Error(
          "Prepared transaction does not match the reviewed quote",
        );
      }

      setCheckoutSession(
        session,
      );
      setPrepared(
        result,
      );
      setStage(
        "review",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to prepare purchase",
      );
    }
  }

  async function waitForReconciledSettlement(
    settlementId: string,
  ) {
    let lastState =
      "submitted";

    for (
      let attempt = 0;
      attempt < 72;
      attempt += 1
    ) {
      const settlement =
        await checkoutService.settlement(
          settlementId,
        );

      lastState =
        settlement.state;

      if (
        settlement.state ===
        "reconciled"
      ) {
        return settlement;
      }

      if (
        settlement.state ===
          "failed" ||
        settlement.state ===
          "manual-review"
      ) {
        throw new Error(
          settlement.errorCode
            ? `Settlement requires attention: ${settlement.errorCode}`
            : `Settlement ended in ${settlement.state}`,
        );
      }

      await sleep(
        2_500,
      );
    }

    throw new Error(
      `Signed purchase is still awaiting Solana finalization (${lastState}). It has not been resubmitted.`,
    );
  }

  async function confirmUntilSettled(
    signature: string,
  ) {
    if (
      !sale ||
      !prepared ||
      !address
    ) {
      throw new Error(
        "Purchase state is incomplete",
      );
    }

    let lastStatus =
      "processing";
    let settlementId:
      string | null = null;
    let slot:
      number | undefined;

    for (
      let attempt = 0;
      attempt < 36;
      attempt += 1
    ) {
      const result =
        await checkoutService.confirm(
          {
            saleId:
              sale.id,
            wallet:
              address,
            reviewId:
              prepared.plan.id,
            signature,
          },
        );

      lastStatus =
        result.status;
      slot =
        result.slot ??
        slot;

      if (
        result.settlementId
      ) {
        settlementId =
          result.settlementId;
        updatePendingSettlement(
          settlementId,
        );
      }

      if (
        result.status ===
          "failed"
      ) {
        throw new Error(
          "Solana transaction failed",
        );
      }

      if (
        result.status ===
          "confirmed" &&
        settlementId
      ) {
        const finality =
          await waitForReconciledSettlement(
            settlementId,
          );

        return {
          ...result,
          slot,
          settlementId,
          settlementState:
            finality.state,
          reconciledAt:
            finality.reconciledAt,
        };
      }

      await sleep(
        2_000,
      );
    }

    throw new Error(
      `Signed transaction is still awaiting verified confirmation (${lastStatus}). It has not been resubmitted.`,
    );
  }

  async function sign() {
    if (
      !prepared?.plan
        .serializedTransactionBase64 ||
      !address
    ) {
      return;
    }

    setStage(
      "submitting",
    );
    setError(null);

    try {
      const signature =
        await signer.signAndSend(
          prepared.plan
            .serializedTransactionBase64,
        );

      savePendingPurchase({
        saleId,
        wallet: address,
        reviewId:
          prepared.plan.id,
        signature,
        savedAt:
          new Date().toISOString(),
      });

      const confirmed =
        await confirmUntilSettled(
          signature,
        );

      setReceipt({
        saleId,
        reviewId:
          prepared.plan.id,
        signature,
        wallet:
          address,
        cluster:
          prepared.plan.cluster,
        settledAt:
          confirmed.reconciledAt ??
          new Date().toISOString(),
        slot:
          confirmed.slot,
      });

      clearPendingPurchase();
      setStage(
        "success",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Purchase failed",
      );
      setStage(
        "review",
      );
    }
  }

  if (
    stage === "loading"
  ) {
    return (
      <LoadingState
        label="Loading secure checkout…"
      />
    );
  }

  if (
    stage === "recovering"
  ) {
    return (
      <LoadingState
        label="Recovering signed purchase confirmation…"
      />
    );
  }

  if (
    stage === "error" ||
    !sale
  ) {
    return (
      <ErrorState
        title="Checkout unavailable"
        description={
          error ??
          "Sale could not be loaded."
        }
      />
    );
  }

  if (
    stage === "success" &&
    receipt
  ) {
    return (
      <PurchaseSuccess
        receipt={receipt}
      />
    );
  }

  if (
    stage === "review" ||
    stage ===
      "submitting"
  ) {
    if (!prepared) {
      return (
        <ErrorState
          title="Prepared transaction missing"
          description="Return to the sale and prepare the purchase again."
        />
      );
    }

    return (
      <>
        {error ? (
          <Alarm
            tone="danger"
            title="Purchase not completed"
          >
            {error}
          </Alarm>
        ) : null}

        <TransactionReview
          plan={
            prepared.plan
          }
          onBack={() => {
            setStage(
              "amount",
            );
            setPrepared(
              null,
            );
            setError(null);
          }}
          onSubmit={() =>
            void sign()
          }
          submitting={
            stage ===
            "submitting"
          }
        />
      </>
    );
  }

  return (
    <div className="checkout-flow-grid">
      <section className="checkout-main-column">
        <div className="checkout-section-heading">
          <div>
            <span className="eyebrow">
              PowerChain Checkout
            </span>
            <h1>
              Buy {sale.symbol}
            </h1>
            <p>
              Server quote, exact
              transaction review,
              wallet signature and
              verified settlement.
            </p>
          </div>

          <CheckoutWalletButton />
        </div>

        {!saleOpen ? (
          <Alarm
            tone="warning"
            title="Sale is not open"
          >
            This checkout cannot
            prepare a purchase until
            the sale is active.
          </Alarm>
        ) : null}

        <PaymentMethods
          value={
            paymentMethod
          }
          onChange={
            setPaymentMethod
          }
        />

        {paymentMethod ===
        "wallet" ? (
          <TabPanel value="wallet">
            <Card className="purchase-form-card">
              <div className="purchase-token-row">
                <AssetIcon
                  kind="token"
                  id={
                    sale.symbol
                  }
                  size={42}
                />
                <div>
                  <strong>
                    {sale.name}
                  </strong>
                  <span>
                    {sale.symbol} ·
                    Token-2022
                  </span>
                </div>
                <Badge
                  tone={
                    saleOpen
                      ? "success"
                      : "warning"
                  }
                >
                  {sale.phase}
                </Badge>
              </div>

              <Form
                onSubmit={event => {
                  event.preventDefault();
                  void prepare();
                }}
              >
                <FormField
                  name="amount"
                  label="Purchase amount (USD)"
                  inputMode="decimal"
                  value={amount}
                  onChange={event =>
                    setAmount(
                      event.target
                        .value,
                    )
                  }
                  hint={`Sale limits: $${usdFromMicros(
                    sale.min_purchase_usd_micros,
                  ).toLocaleString()} – $${usdFromMicros(
                    sale.max_purchase_usd_micros,
                  ).toLocaleString()}`}
                  required
                />

                {error ? (
                  <Alarm
                    tone="danger"
                    title="Check purchase"
                  >
                    {error}
                  </Alarm>
                ) : null}

                {!address ? (
                  <Information
                    title="Wallet required"
                    compact
                  >
                    Connect the Solana
                    wallet that will
                    pay SOL and receive
                    the purchase
                    entitlement.
                  </Information>
                ) : null}

                <FormActions>
                  <Button
                    type="submit"
                    size="lg"
                    block
                    disabled={
                      !saleOpen ||
                      !address
                    }
                  >
                    Prepare exact
                    transaction
                  </Button>
                </FormActions>
              </Form>
            </Card>
          </TabPanel>
        ) : null}

        {paymentMethod ===
        "onramp" ? (
          <TabPanel value="onramp">
            <Onramp
              saleId={
                sale.id
              }
            />
          </TabPanel>
        ) : null}
      </section>

      <aside className="checkout-side-column">
        <Invoice
          title="Purchase summary"
          lines={[
            {
              label:
                "Purchase principal",
              valueUsd:
                orderSummary.principal,
              detail:
                `${sale.symbol} price $${usdFromMicros(
                  sale.price_usd_micros,
                ).toLocaleString("en-US", {
                  maximumFractionDigits: 6,
                })}`,
            },
            {
              label:
                "PowerChain fee",
              valueUsd:
                orderSummary.fee,
              detail:
                "2.5% purchase service fee",
            },
          ]}
          totalUsd={
            orderSummary.total
          }
          status={
            orderSummary.exact
              ? "Exact quote"
              : "Estimate"
          }
        />

        <Card className="market-card">
          <div className="market-card-heading">
            <div>
              <span className="eyebrow">
                Market conversion
              </span>
              <h3>
                SOL / USD
              </h3>
            </div>
            <Badge
              tone={
                marketPrice?.stale
                  ? "warning"
                  : "info"
              }
            >
              {marketPrice
                ? `${marketPrice.sourceCount} source${
                    marketPrice.sourceCount ===
                    1
                      ? ""
                      : "s"
                  }`
                : "Unavailable"}
            </Badge>
          </div>

          <strong className="market-price">
            {marketPrice?.priceUsd
              ? `$${marketPrice.priceUsd.toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits:
                      4,
                  },
                )}`
              : "—"}
          </strong>

          <small>
            Informational here. The
            backend snapshots a fresh
            SOL/USD price again while
            building the exact
            transaction.
          </small>

          {marketPrice
            ?.sources.length ? (
            <div className="market-sources">
              {marketPrice.sources.map(
                source => (
                  <span
                    key={
                      source.provider
                    }
                  >
                    {
                      source.provider
                    }
                  </span>
                ),
              )}
            </div>
          ) : null}
        </Card>

        {prepared ? (
          <Card>
            <span className="eyebrow">
              Purchase quantity
            </span>
            <strong className="prepared-token-amount">
              {tokenFromBaseUnits(
                prepared.quote
                  .tokenBaseUnits,
                prepared.quote
                  .decimals,
              )}{" "}
              {
                prepared.quote
                  .symbol
              }
            </strong>
          </Card>
        ) : null}

        {checkoutSession ? (
          <Card>
            <span className="eyebrow">
              Checkout session
            </span>
            <code className="session-id">
              {
                checkoutSession
                  .checkout.id
              }
            </code>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}
