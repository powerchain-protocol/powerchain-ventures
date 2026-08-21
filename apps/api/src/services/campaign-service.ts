import bs58 from "bs58";
import { PublicKey, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import type { TransactionReview } from "@powerchain/types";
import { createId } from "../common/ids.js";
import { AppError } from "../common/errors.js";
import { env } from "../env/index.js";
import { launchRepository } from "../repositories/launch-repository.js";
import { withRpcFallback } from "../lib/solana-rpc.js";
import { buildReadiness } from "./readiness-service.js";
import { transactionRepository } from "../repositories/transaction-repository.js";

function requireProgramId() {
  if (!env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID) throw new AppError("launchpad_program_not_configured", "POWERCHAIN_LAUNCHPAD_PROGRAM_ID is required to prepare an on-chain launch transaction.", 503);
  try { return new PublicKey(env.POWERCHAIN_LAUNCHPAD_PROGRAM_ID); }
  catch { throw new AppError("invalid_launchpad_program", "POWERCHAIN_LAUNCHPAD_PROGRAM_ID is not a valid Solana address.", 500); }
}

function launchSeed(id: string) { return Buffer.from(id.replaceAll("-", "").slice(0, 32), "utf8"); }

export async function prepareCampaignLaunch(launchId: string, authorityAddress: string, simulate = true): Promise<TransactionReview> {
  const launch = await launchRepository.findById(launchId);
  if (!launch) throw new AppError("launch_not_found", "Launch not found.", 404);
  const readiness = await buildReadiness(launch.id);
  if (readiness.blockingIssues > 0) throw new AppError("launch_not_ready", `Resolve ${readiness.blockingIssues} blocking readiness issue(s) before preparing activation.`, 409);
  const programId = requireProgramId();
  const authority = new PublicKey(authorityAddress);
  const seed = launchSeed(launch.id);
  const [launchPda] = PublicKey.findProgramAddressSync([Buffer.from("launch"), seed], programId);
  const connectionResult = await withRpcFallback(async (connection) => ({ connection, blockhash: await connection.getLatestBlockhash("finalized") }));
  const existingAccount = await connectionResult.connection.getAccountInfo(launchPda, "confirmed");
  const instructions: TransactionInstruction[] = [];
  if (!existingAccount) {
    instructions.push(new TransactionInstruction({
      programId,
      keys: [
        { pubkey: launchPda, isSigner: false, isWritable: true },
        { pubkey: authority, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      data: Buffer.concat([Buffer.from([0, seed.length]), seed])
    }));
  }
  instructions.push(new TransactionInstruction({
    programId,
    keys: [
      { pubkey: launchPda, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: false }
    ],
    data: Buffer.from([2])
  }));
  instructions.push(new TransactionInstruction({
    programId,
    keys: [
      { pubkey: launchPda, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: false }
    ],
    data: Buffer.from([3])
  }));
  const message = new TransactionMessage({ payerKey: authority, recentBlockhash: connectionResult.blockhash.blockhash, instructions }).compileToV0Message();
  const transaction = new VersionedTransaction(message);
  let simulation: TransactionReview["simulation"] = { status: "not-run" };
  if (simulate) {
    const result = await connectionResult.connection.simulateTransaction(transaction, { sigVerify: false, replaceRecentBlockhash: true, commitment: "processed" });
    simulation = result.value.err
      ? { status: "failed", logs: result.value.logs ?? [], error: JSON.stringify(result.value.err) }
      : { status: "passed", logs: result.value.logs ?? [], error: null };
  }
  const fee = await connectionResult.connection.getFeeForMessage(message, "confirmed");
  const review: TransactionReview = {
    id: createId(), action: "ACTIVATE_LAUNCH", network: "solana", cluster: env.SOLANA_CLUSTER, programId: programId.toBase58(), authority: authority.toBase58(), launchId: launch.id,
    instructions: [
      ...(!existingAccount ? [{ programId: programId.toBase58(), name: "InitializeLaunch", accounts: [launchPda.toBase58(), authority.toBase58(), SystemProgram.programId.toBase58()], data: Buffer.concat([Buffer.from([0, seed.length]), seed]).toString("base64") }] : []),
      { programId: programId.toBase58(), name: "MoveLaunchToReview", accounts: [launchPda.toBase58(), authority.toBase58()], data: Buffer.from([2]).toString("base64") },
      { programId: programId.toBase58(), name: "ActivateLaunch", accounts: [launchPda.toBase58(), authority.toBase58()], data: Buffer.from([3]).toString("base64") }
    ],
    serializedTransactionBase64: Buffer.from(transaction.serialize()).toString("base64"),
    estimatedNetworkFeeLamports: fee.value ?? undefined,
    simulation,
    requiresWalletSignature: true,
    expiresAt: new Date(Date.now() + 90_000).toISOString()
  };
  await transactionRepository.storeReview(review);
  return review;
}

export async function confirmCampaignLaunch(launchId: string, reviewId: string, signature: string, authorityAddress: string) {
  const programId = requireProgramId();
  const authority = new PublicKey(authorityAddress);
  const launch = await launchRepository.findById(launchId);
  if (!launch) throw new AppError("launch_not_found", "Launch not found.", 404);
  await transactionRepository.assertReview(reviewId, launch.id, authority.toBase58());
  const seed = launchSeed(launch.id);
  const [launchPda] = PublicKey.findProgramAddressSync([Buffer.from("launch"), seed], programId);
  const parsed = await withRpcFallback((connection) => connection.getParsedTransaction(signature, { commitment: "confirmed", maxSupportedTransactionVersion: 0 }));
  if (!parsed) throw new AppError("transaction_not_found", "The submitted Solana transaction is not yet visible.", 409);
  if (parsed.meta?.err) throw new AppError("transaction_failed", "The launch transaction failed on Solana.", 409);
  const keys = parsed.transaction.message.accountKeys;
  const authorityKey = keys.find((entry) => entry.pubkey.equals(authority));
  if (!authorityKey?.signer) throw new AppError("authority_not_signer", "The expected launch authority did not sign this transaction.", 409);
  if (!keys.some((entry) => entry.pubkey.equals(launchPda))) throw new AppError("launch_account_mismatch", "The transaction does not reference the expected launch account.", 409);
  const activationInstruction = parsed.transaction.message.instructions.find((instruction) => {
    if (!instruction.programId.equals(programId) || !("data" in instruction) || typeof instruction.data !== "string") return false;
    try { return bs58.decode(instruction.data)[0] === 3; } catch { return false; }
  });
  if (!activationInstruction) throw new AppError("program_mismatch", "The transaction does not contain the expected PowerChain launch activation instruction.", 409);
  const chainState = await withRpcFallback((connection) => connection.getAccountInfo(launchPda, "confirmed"));
  if (!chainState || !chainState.owner.equals(programId) || chainState.data.length < 35) throw new AppError("launch_state_missing", "The expected on-chain launch state is unavailable after confirmation.", 409);
  const initialized = chainState.data[1] === 1;
  const chainAuthority = new PublicKey(chainState.data.subarray(2, 34));
  const chainStatus = chainState.data[34];
  if (!initialized || !chainAuthority.equals(authority) || chainStatus !== 2) throw new AppError("launch_state_mismatch", "The confirmed transaction did not leave the expected launch account in LIVE state.", 409);
  await transactionRepository.markConfirmed(reviewId, signature, parsed.slot);
  return launchRepository.markLive(launchId, signature);
}
