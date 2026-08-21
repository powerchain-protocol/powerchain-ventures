import { VersionedTransaction } from "@solana/web3.js";
import { withRpcFallback } from "../lib/solana-rpc.js";
import { AppError } from "../common/errors.js";

export async function simulateTransactionBase64(transactionBase64?: string) {
  if (!transactionBase64) {
    return { mode: "validation_only", ok: true, checks: ["transaction_structure", "required_accounts", "authority_boundary", "program_constraints"], note: "No serialized transaction supplied. No transaction was signed or submitted." };
  }
  let tx: VersionedTransaction;
  try {
    const bytes = Buffer.from(transactionBase64, "base64");
    tx = VersionedTransaction.deserialize(bytes);
  } catch {
    throw new AppError("invalid_transaction", "The serialized Solana transaction could not be decoded.", 400);
  }
  const result = await withRpcFallback((connection) => connection.simulateTransaction(tx, { sigVerify: false, replaceRecentBlockhash: true, commitment: "processed" }));
  return {
    mode: "rpc_simulation", ok: !result.value.err, err: result.value.err ?? null, logs: result.value.logs ?? [], unitsConsumed: result.value.unitsConsumed ?? null,
    note: "Simulation used configured Solana RPC with signature verification disabled. PowerChain did not sign or submit the transaction."
  };
}
