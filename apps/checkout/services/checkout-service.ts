import {
  getJson,
  postJson,
} from "../lib/api";
import type {
  PreparedPurchase,
  PurchaseQuote,
  Sale,
} from "../types/checkout";

export type CheckoutSession = {
  checkout: {
    id: string;
    saleId: string;
    wallet: string;
    usdMicros: string;
    currency: "USD";
    paymentAsset: "SOL";
    sale: {
      name: string;
      symbol: string;
      mint: string;
      decimals: number;
      priceUsdMicros: string;
      serviceFeeBps: number;
      deliveryMode: string;
    };
    conversion: {
      provider: string;
      observedAt: string;
      solUsd: number | null;
      pwrcUsd: number | null;
      pwrcPerSol: number | null;
      solPerPwrc: number | null;
      estimatedPrincipal:
        | {
            estimatedLamports: string;
            estimatedSol: number;
          }
        | null;
      estimatedServiceFee:
        | {
            estimatedLamports: string;
            estimatedSol: number;
          }
        | null;
      note: string;
    };
  };
  idempotencyKey: string;
};

export const checkoutService = {
  async sale(
    saleId: string,
  ) {
    const result =
      await getJson<{
        sales: Sale[];
      }>(
        `/api/v1/launchpad/catalog?saleId=${encodeURIComponent(
          saleId,
        )}`,
      );

    const sale =
      result.sales[0];

    if (!sale) {
      throw new Error(
        "Sale not found",
      );
    }

    return sale;
  },

  marketPrice() {
    return getJson<{
      price: {
        available: boolean;
        priceUsd: number | null;
        observedAt: string;
        sourceCount: number;
        sources: Array<{
          provider: string;
          priceUsd: number;
        }>;
        maxDivergenceBps:
          number | null;
        stale: boolean;
      };
    }>(
      "/api/v1/market/prices?asset=SOL",
    );
  },

  createSession(
    input: {
      saleId: string;
      wallet: string;
      usdMicros: string;
    },
  ) {
    const idempotencyKey =
      crypto.randomUUID();

    return postJson<
      CheckoutSession,
      typeof input
    >(
      "/api/v1/checkout",
      input,
      {
        idempotencyKey,
      },
    );
  },

  quote(
    input: {
      saleId: string;
      wallet: string;
      usdMicros: string;
    },
  ) {
    return postJson<
      PurchaseQuote,
      typeof input
    >(
      "/api/v1/launchpad/quote",
      input,
    );
  },

  prepare(
    input: {
      saleId: string;
      wallet: string;
      usdMicros: string;
    },
    idempotencyKey: string,
  ) {
    return postJson<
      PreparedPurchase,
      typeof input
    >(
      "/api/v1/launchpad/purchase/prepare",
      input,
      {
        idempotencyKey,
      },
    );
  },

  settlement(
    settlementId: string,
  ) {
    return getJson<{
      settlementId: string;
      mutationId: string;
      kind:
        | "purchase"
        | "claim"
        | "creator";
      state:
        | "created"
        | "submitted"
        | "observed"
        | "confirmed"
        | "finalized"
        | "reconciled"
        | "failed"
        | "manual-review";
      transactionSignature?: string;
      submittedAt?: string;
      observedAt?: string;
      finalizedAt?: string;
      reconciledAt?: string;
      errorCode?: string;
      createdAt: string;
      updatedAt: string;
    }>(
      `/api/v1/settlements/${encodeURIComponent(
        settlementId,
      )}`,
    );
  },


  solanaPayStatus(
    reviewId: string,
  ) {
    return getJson<{
      found: boolean;
      signature?: string;
      slot?: number;
      confirmationStatus?: string;
    }>(
      `/api/v1/payments/solana-pay/status?reviewId=${encodeURIComponent(
        reviewId,
      )}`,
    );
  },


  paymentConfig() {
    return getJson<{
      defaultMethod:
        "sol-pwrc";
      methods: {
        solPwrc: {
          enabled: boolean;
          settlement: string;
        };
        solanaPay: {
          enabled: boolean;
          settlement: string;
        };
        coinbaseOnramp: {
          enabled: boolean;
          settlement: string;
        };
        stripe: {
          enabled: boolean;
          configured: boolean;
          settlement: string;
          hostedUrl?: string;
        };
        usdc: {
          enabled: boolean;
          settlement: string;
        };
        cctp: {
          enabled: boolean;
          settlement: string;
        };
        sui: {
          enabled: boolean;
          settlement: string;
        };
        zkCompression: {
          enabled: boolean;
          settlement: string;
        };
      };
    }>(
      "/api/v1/payments/config",
    );
  },

  protocols() {
    return getJson<{
      solana: {
        cluster:
          | "devnet"
          | "mainnet-beta";
        programs:
          Record<
            string,
            string
          >;
      };
      pyth: unknown;
      cctp: unknown;
      protocols: unknown;
    }>(
      "/api/v1/protocols",
    );
  },

  confirm(
    input: {
      saleId: string;
      wallet: string;
      reviewId: string;
      signature: string;
    },
  ) {
    return postJson<
      {
        status: string;
        reviewId: string;
        slot?: number;
        settlementId?: string;
        settlementState?: string;
      },
      typeof input
    >(
      "/api/v1/launchpad/purchase/confirm",
      input,
    );
  },
};
