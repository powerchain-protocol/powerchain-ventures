import {PublicKey} from "@solana/web3.js";
import {SOLANA_TOKEN_2022_PROGRAM_ID} from "@powerchain/launchpad-config";
import {solanaRpc} from "./solana-rpc";

type RpcAccount={value:{owner:string;data:[string,string];executable:boolean}|null};
export type Token2022AccountState={address:string;mint:string;owner:string;amountBaseUnits:string;state:number;rpcEndpoint:string};

export async function readToken2022Account(address:string):Promise<Token2022AccountState|null>{
 const {result,endpoint}=await solanaRpc<RpcAccount>("getAccountInfo",[address,{encoding:"base64",commitment:"confirmed"}]);
 if(!result?.value)return null;if(result.value.owner!==SOLANA_TOKEN_2022_PROGRAM_ID)throw new Error("token_account_program_mismatch");
 const data=Buffer.from(result.value.data[0],"base64");if(data.length<165)throw new Error("token_account_data_too_short");
 const mint=new PublicKey(data.subarray(0,32)).toBase58(),owner=new PublicKey(data.subarray(32,64)).toBase58(),amountBaseUnits=data.readBigUInt64LE(64).toString(),state=data[108]??0;
 return {address,mint,owner,amountBaseUnits,state,rpcEndpoint:endpoint};
}

export async function assertProgramVaultOwnership(input:{vault:string;mint:string;vaultAuthority:string}){
 const account=await readToken2022Account(input.vault);if(!account)throw new Error("sale_vault_not_found");
 if(account.mint!==input.mint)throw new Error("sale_vault_mint_mismatch");if(account.owner!==input.vaultAuthority)throw new Error("sale_vault_authority_not_adopted");if(account.state===0)throw new Error("sale_vault_not_initialized");return account;
}
