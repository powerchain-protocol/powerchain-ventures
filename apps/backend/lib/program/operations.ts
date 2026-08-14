import {deriveParticipantPda,deriveSalePda,deriveVaultAuthorityPda,operationToReview,buildClaimOperation,buildLifecycleOperation,buildPauseOperation,buildPurchaseOperation,buildSaleActivationOperations,buildTimingOperation,type ProgramOperation} from "@powerchain/launchpad-program-client";
import {configuredLaunchpadProgramId} from "./config";

export type SaleProgramBinding={programId:string;salePda:string;vaultAuthorityPda:string;stateVersion:number};
export function deriveSaleProgramBinding(input:{saleId:string;creatorWallet:string;mint:string}):SaleProgramBinding{const programId=configuredLaunchpadProgramId();if(!programId)throw new Error("launchpad_program_not_configured");const sale=deriveSalePda({programId,creator:input.creatorWallet,mint:input.mint,saleId:input.saleId});const vault=deriveVaultAuthorityPda(programId,sale.address);return {programId,salePda:sale.address.toBase58(),vaultAuthorityPda:vault.address.toBase58(),stateVersion:1}}
export function participantPda(salePda:string,wallet:string){const programId=configuredLaunchpadProgramId();if(!programId)throw new Error("launchpad_program_not_configured");return deriveParticipantPda(programId,salePda,wallet).address.toBase58()}
export function reviewsForOperations(operations:ProgramOperation[]){return operations.map((operation,index)=>operationToReview(operation,index))}
export {buildClaimOperation,buildLifecycleOperation,buildPauseOperation,buildPurchaseOperation,buildSaleActivationOperations,buildTimingOperation};
