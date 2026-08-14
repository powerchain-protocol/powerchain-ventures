import {createHash} from "node:crypto";
import type {BuilderPlan} from "./transaction-builder";

function stable(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const record=value as Record<string,unknown>;
  return `{${Object.keys(record).sort().map(k=>`${JSON.stringify(k)}:${stable(record[k])}`).join(",")}}`;
}

export function reviewPlanHash(plan: BuilderPlan): string {
  const bound={
    cluster:plan.cluster, feePayer:plan.feePayer, recentBlockhash:plan.recentBlockhash??null,
    instructions:plan.instructions, fees:plan.fees, recipients:plan.recipients,
    serializedTransactionBase64:plan.serializedTransactionBase64??null,
    expiresAt:plan.expiresAt??null, simulation:plan.simulation??null,
  };
  return createHash("sha256").update(stable(bound)).digest("hex");
}

export function assertStoredPlanIntegrity(plan: BuilderPlan, expectedHash: string): void {
  const actual=reviewPlanHash(plan);
  if (!/^[a-f0-9]{64}$/.test(expectedHash) || actual!==expectedHash) throw new Error("prepared_transaction_integrity_mismatch");
}
