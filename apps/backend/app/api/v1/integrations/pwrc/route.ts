import {POWERCHAIN_PWRC_MINT_ADDRESS} from "@powerchain/launchpad-config";
import {error,json} from "../../../../../lib/http";
import {getTokenMarketSnapshot} from "../../../../../lib/integrations/token-market";
import {enforceRateLimit} from "../../../../../lib/rate-limit-response";
export async function GET(request:Request){const limited=await enforceRateLimit(request,"integration.pwrc",30);if(limited)return limited;const mint=process.env.POWERCHAIN_PRESALE_MINT?.trim()||POWERCHAIN_PWRC_MINT_ADDRESS;if(!mint)return error("CONFIGURATION_ERROR","Canonical PWRC mainnet mint has not been configured",503);try{return json({symbol:"PWRC",mint,market:await getTokenMarketSnapshot(mint)})}catch(e){return error("INTERNAL_ERROR",e instanceof Error?e.message:"Unable to load PWRC data",500)}}
