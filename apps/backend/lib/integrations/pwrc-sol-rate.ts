import {SOLANA_WRAPPED_NATIVE_MINT_ADDRESS} from "@powerchain/launchpad-config";
import {birdeyePrice} from "@powerchain/integrations";
import {integrationConfig} from "./config";

export type PwrcSolRate = {
  available: boolean;
  pwrcMint: string;
  solMint: string;
  pwrcUsd: number | null;
  solUsd: number | null;
  pwrcPerSol: number | null;
  solPerPwrc: number | null;
  observedAt: string;
  provider: "birdeye" | "unavailable";
};

export async function getPwrcSolRate(pwrcMint:string):Promise<PwrcSolRate>{
  const c=integrationConfig();
  const base={pwrcMint,solMint:SOLANA_WRAPPED_NATIVE_MINT_ADDRESS,observedAt:new Date().toISOString()};
  if(!c.birdeyeApiKey)return {...base,available:false,pwrcUsd:null,solUsd:null,pwrcPerSol:null,solPerPwrc:null,provider:"unavailable"};
  try{
    const [pwrc,sol]=await Promise.all([
      birdeyePrice({apiKey:c.birdeyeApiKey,mint:pwrcMint,baseUrl:c.birdeyeBaseUrl}),
      birdeyePrice({apiKey:c.birdeyeApiKey,mint:SOLANA_WRAPPED_NATIVE_MINT_ADDRESS,baseUrl:c.birdeyeBaseUrl}),
    ]);
    const pwrcUsd=typeof pwrc.data?.value==="number"&&pwrc.data.value>0?pwrc.data.value:null;
    const solUsd=typeof sol.data?.value==="number"&&sol.data.value>0?sol.data.value:null;
    return {...base,available:Boolean(pwrcUsd&&solUsd),pwrcUsd,solUsd,pwrcPerSol:pwrcUsd&&solUsd?solUsd/pwrcUsd:null,solPerPwrc:pwrcUsd&&solUsd?pwrcUsd/solUsd:null,provider:"birdeye"};
  }catch{return {...base,available:false,pwrcUsd:null,solUsd:null,pwrcPerSol:null,solPerPwrc:null,provider:"unavailable"}}
}

export function presaleSolEstimate(usdMicros:string,solUsd:number|null){
  if(!solUsd||solUsd<=0)return null;
  const micros=BigInt(usdMicros);
  const solUsdMicros=BigInt(Math.round(solUsd*1_000_000));
  if(solUsdMicros<=0n)return null;
  const lamports=(micros*1_000_000_000n+solUsdMicros-1n)/solUsdMicros;
  return {solUsd,solUsdMicros:solUsdMicros.toString(),estimatedLamports:lamports.toString(),estimatedSol:Number(lamports)/1_000_000_000};
}
