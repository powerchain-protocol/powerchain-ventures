"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Badge,
  ButtonLink,
  Card,
  CardBody,
  CardHeader,
  ErrorState,
  LoadingState,
} from "@powerchain/ui";

type Sale = {
  id: string;
  name: string;
  mint: string;
  symbol: string;
  decimals: number;
  phase: string;
  starts_at: string;
  ends_at: string;
  price_usd_micros: string;
  allocation_base_units: string;
  sold_base_units: string;
  min_purchase_usd_micros: string;
  max_purchase_usd_micros: string;
  service_fee_bps: number;
  delivery_mode: string;
  metrics?: {
    raisedUsdMicros: string;
    soldBaseUnits: string;
    participants: number;
  };
};

function usd(
  micros: string,
) {
  return (
    Number(BigInt(micros)) /
    1_000_000
  );
}

function checkoutUrl(
  saleId: string,
) {
  const base =
    process.env
      .NEXT_PUBLIC_CHECKOUT_URL ||
    "http://localhost:3002";

  return `${base.replace(
    /\/+$/,
    "",
  )}/checkout/${encodeURIComponent(
    saleId,
  )}`;
}

export function SaleOverview({
  saleId,
}: {
  saleId: string;
}) {
  const [sale, setSale] =
    useState<Sale | null>(
      null,
    );
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    let live = true;

    void fetch(
      `/api/v1/launchpad/catalog?saleId=${encodeURIComponent(
        saleId,
      )}`,
      {
        cache: "no-store",
      },
    )
      .then(async response => {
        const body =
          await response.json();

        if (!response.ok) {
          throw new Error(
            body?.error?.message ??
              "Unable to load sale",
          );
        }

        return body;
      })
      .then(body => {
        if (live) {
          setSale(
            body.sales?.[0] ??
              null,
          );
        }
      })
      .catch(cause => {
        if (live) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load sale",
          );
        }
      })
      .finally(() => {
        if (live) {
          setLoading(false);
        }
      });

    return () => {
      live = false;
    };
  }, [saleId]);

  if (loading) {
    return (
      <LoadingState
        label="Loading sale…"
      />
    );
  }

  if (
    error ||
    !sale
  ) {
    return (
      <ErrorState
        title="Sale unavailable"
        description={
          error ??
          "Sale not found"
        }
      />
    );
  }

  const now =
    Date.now();
  const open =
    (
      sale.phase ===
        "public" ||
      sale.phase ===
        "private"
    ) &&
    now >=
      Date.parse(
        sale.starts_at,
      ) &&
    now <
      Date.parse(
        sale.ends_at,
      );

  return (
    <div className="sale-overview-layout">
      <Card>
        <CardHeader
          eyebrow="Token sale"
          title={`${sale.name} · ${sale.symbol}`}
          description="Sale information is displayed here. Payment and transaction signing are owned exclusively by PowerChain Checkout."
          action={
            <Badge
              tone={
                open
                  ? "success"
                  : "warning"
              }
              dot
            >
              {sale.phase}
            </Badge>
          }
        />

        <CardBody>
          <div className="sale-overview-metrics">
            <div>
              <span>
                Token price
              </span>
              <strong>
                $
                {usd(
                  sale.price_usd_micros,
                ).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits:
                      6,
                  },
                )}
              </strong>
            </div>
            <div>
              <span>
                Minimum
              </span>
              <strong>
                $
                {usd(
                  sale.min_purchase_usd_micros,
                ).toLocaleString()}
              </strong>
            </div>
            <div>
              <span>
                Maximum
              </span>
              <strong>
                $
                {usd(
                  sale.max_purchase_usd_micros,
                ).toLocaleString()}
              </strong>
            </div>
            <div>
              <span>
                Service fee
              </span>
              <strong>
                {sale.service_fee_bps /
                  100}
                %
              </strong>
            </div>
            <div>
              <span>
                Delivery
              </span>
              <strong>
                {
                  sale.delivery_mode
                }
              </strong>
            </div>
            <div>
              <span>
                Participants
              </span>
              <strong>
                {sale.metrics
                  ?.participants ??
                  0}
              </strong>
            </div>
          </div>

          <div className="sale-overview-wallet">
            <span>
              Token mint
            </span>
            <code>
              {sale.mint}
            </code>
          </div>

          <div className="sale-overview-actions">
            <ButtonLink
              href={checkoutUrl(
                sale.id,
              )}
              size="lg"
              block
              className={
                open
                  ? ""
                  : "disabled-link"
              }
            >
              {open
                ? "Continue to secure checkout"
                : "Checkout unavailable"}
            </ButtonLink>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
