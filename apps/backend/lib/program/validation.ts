import type {BuilderPlan} from "../transaction-builder";
import {configuredLaunchpadProgramId} from "./config";

export type ExpectedProgramOperation={operation:"initialize-sale"|"purchase"|"claim"|"cancel"|"complete"|"pause"|"resume"|"update-timing";salePda:string;participantPda?:string;requiredSigners?:string[]};

export function assertBuilderUsesLaunchpadProgram(plan:BuilderPlan,expected:ExpectedProgramOperation){
 const programId=configuredLaunchpadProgramId();if(!programId)throw new Error("launchpad_program_not_configured");
 const op=plan.programOperation;if(!op)throw new Error("builder_program_operation_missing");
 if(op.programId!==programId||op.operation!==expected.operation||op.salePda!==expected.salePda)throw new Error("builder_program_operation_mismatch");
 if(expected.participantPda&&op.participantPda!==expected.participantPda)throw new Error("builder_participant_pda_mismatch");
 const ix=plan.instructions.find(ix=>ix.programId===programId&&ix.dataBase64===op.instructionDataBase64);
 if(!ix)throw new Error("builder_launchpad_instruction_missing");
 if(!ix.accounts.some(a=>a.address===expected.salePda&&a.writable))throw new Error("builder_sale_pda_missing");
 if(expected.participantPda&&!ix.accounts.some(a=>a.address===expected.participantPda&&a.writable))throw new Error("builder_participant_account_missing");
 for(const signer of expected.requiredSigners??[])if(!ix.accounts.some(a=>a.address===signer&&a.signer))throw new Error("builder_required_program_signer_missing");
}
