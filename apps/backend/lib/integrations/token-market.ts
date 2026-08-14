import {birdeyePrice,birdeyeTokenOverview,heliusRpc} from "@powerchain/integrations";
import {insert} from "../supabase-rest";
import {integrationConfig} from "./config";

type DasAsset={id?:string;content?:Record<string,unknown>;token_info?:Record<string,unknown>;authorities?:unknown[]};
function rejectedMessage(value:PromiseSettledResult<unknown>){if(value.status!=="rejected")return null;const message=value.reason instanceof Error?value.reason.message:"provider_unavailable";return message.split(":",1)[0].slice(0,120)}

export async function getTokenMarketSnapshot(mint:string){
 const c=integrationConfig();
 const [price,overview,asset]=await Promise.allSettled([
  c.birdeyeApiKey?birdeyePrice({apiKey:c.birdeyeApiKey,mint,baseUrl:c.birdeyeBaseUrl}):Promise.reject(new Error("birdeye_not_configured")),
  c.birdeyeApiKey?birdeyeTokenOverview({apiKey:c.birdeyeApiKey,mint,baseUrl:c.birdeyeBaseUrl}):Promise.reject(new Error("birdeye_not_configured")),
  c.heliusApiKey?heliusRpc<DasAsset>({apiKey:c.heliusApiKey,rpcBase:c.heliusRpcBase,method:"getAsset",params:[{id:mint}]}):Promise.reject(new Error("helius_not_configured")),
 ]);
 const p=price.status==="fulfilled"?price.value.data:null;
 const o=overview.status==="fulfilled"?overview.value.data:null;
 const a=asset.status==="fulfilled"?asset.value:null;
 const sources={birdeye:price.status==="fulfilled"||overview.status==="fulfilled",helius:asset.status==="fulfilled"};
 const source=[sources.birdeye&&"birdeye",sources.helius&&"helius"].filter(Boolean).join("+")||"unavailable";
 const snapshot={mint,priceUsd:typeof p?.value==="number"?p.value:null,liquidityUsd:typeof p?.liquidity==="number"?p.liquidity:null,birdeye:o,helius:a,observedAt:new Date().toISOString(),sources,providerErrors:{price:rejectedMessage(price),overview:rejectedMessage(overview),asset:rejectedMessage(asset)}};
 try{await insert("launchpad_token_market_snapshots",{mint,price_usd:snapshot.priceUsd,liquidity_usd:snapshot.liquidityUsd,market_data:o??{},asset_data:a??{},source,observed_at:snapshot.observedAt})}catch{}
 return snapshot;
}
