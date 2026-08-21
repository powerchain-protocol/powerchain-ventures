import type { TransactionReview } from "@powerchain/types";
import { env } from "../env/index.js";
import { AppError } from "../common/errors.js";

const mockReviews = new Map<string, { launchId: string; authority: string; expiresAt: string; status: string; signature?: string }>();

async function database() { return (await import("../lib/prisma.js")).prisma; }

export const transactionRepository = {
  async storeReview(review: TransactionReview) {
    if (env.POWERCHAIN_DATA_MODE === "mock") {
      mockReviews.set(review.id, { launchId: review.launchId, authority: review.authority, expiresAt: review.expiresAt, status: review.simulation.status === "passed" ? "SIMULATED" : "PREPARED" });
      return;
    }
    const prisma = await database();
    await prisma.chainTransaction.create({
      data: {
        id: review.id,
        launchId: review.launchId,
        kind: review.action,
        walletAddress: review.authority,
        status: review.simulation.status === "passed" ? "SIMULATED" : "PREPARED",
        feeLamports: review.estimatedNetworkFeeLamports == null ? undefined : BigInt(review.estimatedNetworkFeeLamports),
        metadata: {
          cluster: review.cluster,
          programId: review.programId,
          expiresAt: review.expiresAt,
          simulation: review.simulation.status,
          instructionNames: review.instructions.map((instruction) => instruction.name)
        }
      }
    });
  },

  async assertReview(reviewId: string, launchId: string, authority: string) {
    if (env.POWERCHAIN_DATA_MODE === "mock") {
      const review = mockReviews.get(reviewId);
      if (!review || review.launchId !== launchId || review.authority !== authority) throw new AppError("transaction_review_mismatch", "The transaction review does not match this launch and authority.", 409);
      if (new Date(review.expiresAt).getTime() <= Date.now()) throw new AppError("transaction_review_expired", "The transaction review has expired. Prepare a fresh transaction.", 409);
      if (review.status === "CONFIRMED") throw new AppError("transaction_review_consumed", "This transaction review has already been confirmed.", 409);
      return;
    }
    const prisma = await database();
    const row = await prisma.chainTransaction.findFirst({ where: { id: reviewId, launchId, walletAddress: authority } });
    if (!row) throw new AppError("transaction_review_mismatch", "The transaction review does not match this launch and authority.", 409);
    if (row.status === "CONFIRMED") throw new AppError("transaction_review_consumed", "This transaction review has already been confirmed.", 409);
    const metadata = row.metadata && typeof row.metadata === "object" && !Array.isArray(row.metadata) ? row.metadata as Record<string, unknown> : {};
    const expiresAt = typeof metadata.expiresAt === "string" ? metadata.expiresAt : undefined;
    if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) throw new AppError("transaction_review_expired", "The transaction review has expired. Prepare a fresh transaction.", 409);
  },

  async markConfirmed(reviewId: string, signature: string, slot: number) {
    if (env.POWERCHAIN_DATA_MODE === "mock") {
      const row = mockReviews.get(reviewId); if (row) mockReviews.set(reviewId, { ...row, status: "CONFIRMED", signature });
      return;
    }
    const prisma = await database();
    await prisma.chainTransaction.update({ where: { id: reviewId }, data: { status: "CONFIRMED", signature, slot: BigInt(slot) } });
  }
};
