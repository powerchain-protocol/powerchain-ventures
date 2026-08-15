import type {
  BuilderPlan,
} from "../transaction-builder";
import {
  select,
} from "../supabase-rest";
import {
  solanaRpc,
} from "../solana-rpc";
import {
  assertStoredPlanIntegrity,
} from "../review-integrity";
import {
  verifyTransactionMatchesPrepared,
} from "../solana-transaction-integrity";

export type SolanaPayReview = {
  id: string;
  wallet: string;
  sale_id: string;
  status: string;
  plan_hash: string;
  plan: BuilderPlan;
  expires_at:
    string | null;
  created_at: string;
};

export async function loadSolanaPayPurchaseReview(
  reviewId: string,
) {
  const rows =
    await select<SolanaPayReview>(
      "launchpad_transaction_reviews",
      `select=id,wallet,sale_id,status,plan_hash,plan,expires_at,created_at&id=eq.${encodeURIComponent(
        reviewId,
      )}&kind=eq.purchase&limit=1`,
    );

  const review =
    rows[0];

  if (!review) {
    throw new Error(
      "solana_pay_review_not_found",
    );
  }

  assertStoredPlanIntegrity(
    review.plan,
    review.plan_hash,
  );

  if (
    !review.plan
      .serializedTransactionBase64
  ) {
    throw new Error(
      "solana_pay_transaction_unavailable",
    );
  }

  if (
    review.expires_at &&
    Date.parse(
      review.expires_at,
    ) <= Date.now() &&
    review.status ===
      "prepared"
  ) {
    throw new Error(
      "solana_pay_review_expired",
    );
  }

  return review;
}

export async function findSolanaPayPurchaseSignature(
  review:
    SolanaPayReview,
) {
  const participant =
    review.plan
      .programOperation
      ?.participantPda;

  if (!participant) {
    throw new Error(
      "solana_pay_participant_missing",
    );
  }

  const response =
    await solanaRpc<
      Array<{
        signature: string;
        slot: number;
        err: unknown;
        blockTime:
          number | null;
        confirmationStatus?:
          | "processed"
          | "confirmed"
          | "finalized"
          | null;
      }>
    >(
      "getSignaturesForAddress",
      [
        participant,
        {
          limit: 20,
          commitment:
            "confirmed",
        },
      ],
    );

  const createdAtSeconds =
    Math.floor(
      Date.parse(
        review.created_at,
      ) / 1000,
    );

  for (
    const candidate
    of response.result
  ) {
    if (
      candidate.err ||
      (
        candidate.blockTime &&
        candidate.blockTime <
          createdAtSeconds -
            30
      )
    ) {
      continue;
    }

    const match =
      await verifyTransactionMatchesPrepared(
        candidate.signature,
        review.plan
          .serializedTransactionBase64!,
      );

    if (match.ok) {
      return {
        signature:
          candidate.signature,
        slot:
          candidate.slot,
        confirmationStatus:
          candidate
            .confirmationStatus ??
          "confirmed",
      };
    }
  }

  return null;
}
