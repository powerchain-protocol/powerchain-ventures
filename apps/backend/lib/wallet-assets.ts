import {POWERCHAIN_PWRC_DECIMALS,POWERCHAIN_PWRC_MINT_ADDRESS} from "@powerchain/launchpad-config";
import {PublicKey} from "@solana/web3.js";
import {getAssociatedTokenAddressSync,TOKEN_2022_PROGRAM_ID} from "@solana/spl-token";
import {solanaRpc} from "./solana-rpc";
import {getPwrcSolRate} from "./integrations/pwrc-sol-rate";

export function configuredPwrcMint(){return process.env.POWERCHAIN_PRESALE_MINT?.trim()||POWERCHAIN_PWRC_MINT_ADDRESS||null}
export function pwrcAta(wallet:string,mint:string){return getAssociatedTokenAddressSync(new PublicKey(mint),new PublicKey(wallet),false,TOKEN_2022_PROGRAM_ID).toBase58()}

type TokenBalanceResult={value:{amount:string;decimals:number;uiAmount:number|null;uiAmountString:string}};
export async function getWalletAssetData(wallet:string){
  const mint=configuredPwrcMint();
  const [solResult,rate]=await Promise.all([
    solanaRpc<number>("getBalance",[wallet,{commitment:"confirmed"}]),
    mint?getPwrcSolRate(mint):Promise.resolve(null),
  ]);
  let pwrc={mint,tokenAccount:null as string|null,amountBaseUnits:"0",decimals:POWERCHAIN_PWRC_DECIMALS,uiAmount:"0",configured:Boolean(mint)};
  if(mint){
    const tokenAccount=pwrcAta(wallet,mint);pwrc={...pwrc,tokenAccount};
    try{const bal=await solanaRpc<TokenBalanceResult>("getTokenAccountBalance",[tokenAccount,{commitment:"confirmed"}]);pwrc={...pwrc,amountBaseUnits:bal.result.value.amount,decimals:bal.result.value.decimals,uiAmount:bal.result.value.uiAmountString}}catch{}
  }
  const solLamports=BigInt(solResult.result);
  const solUi=Number(solLamports)/1_000_000_000;
  const solUsd=rate?.solUsd??null,pwrcUsd=rate?.pwrcUsd??null;
  const pwrcUi=Number(pwrc.uiAmount);
  return {
    wallet,
    cluster:process.env.NEXT_PUBLIC_SOLANA_CLUSTER==="devnet"?"devnet":"mainnet-beta",
    sol:{lamports:solLamports.toString(),uiAmount:solUi,priceUsd:solUsd,valueUsd:solUsd===null?null:solUi*solUsd},
    pwrc:{...pwrc,priceUsd:pwrcUsd,valueUsd:pwrcUsd===null?null:pwrcUi*pwrcUsd},
    conversion:rate?{available:rate.available,pwrcPerSol:rate.pwrcPerSol,solPerPwrc:rate.solPerPwrc,provider:rate.provider,observedAt:rate.observedAt}:null,
    rpc:{endpoint:solResult.endpoint,latencyMs:solResult.latencyMs},
    links:{transactions:`/api/v1/transactions?wallet=${encodeURIComponent(wallet)}`,transferPrepare:"/api/v1/transfers/prepare",transferConfirm:"/api/v1/transfers/confirm"},
  };
}
