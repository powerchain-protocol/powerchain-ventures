import {PublicKey} from "@solana/web3.js";
import {saleSeedFromId} from "./codec.js";

const SALE_SEED=Buffer.from("sale");
const VAULT_SEED=Buffer.from("vault");
const PARTICIPANT_SEED=Buffer.from("participant");

export function deriveSalePda(input:{programId:string|PublicKey;creator:string|PublicKey;mint:string|PublicKey;saleId:string}){
  const programId=asKey(input.programId),creator=asKey(input.creator),mint=asKey(input.mint),seed=saleSeedFromId(input.saleId);
  const [address,bump]=PublicKey.findProgramAddressSync([SALE_SEED,creator.toBuffer(),mint.toBuffer(),seed],programId);
  return {address,bump,seed};
}
export function deriveVaultAuthorityPda(programId:string|PublicKey,salePda:string|PublicKey){const [address,bump]=PublicKey.findProgramAddressSync([VAULT_SEED,asKey(salePda).toBuffer()],asKey(programId));return {address,bump}}
export function deriveParticipantPda(programId:string|PublicKey,salePda:string|PublicKey,wallet:string|PublicKey){const [address,bump]=PublicKey.findProgramAddressSync([PARTICIPANT_SEED,asKey(salePda).toBuffer(),asKey(wallet).toBuffer()],asKey(programId));return {address,bump}}
export function asKey(value:string|PublicKey){return value instanceof PublicKey?value:new PublicKey(value)}
