import {error,json} from "../../../../../../lib/http";
import {requireSolanaAddress} from "../../../../../../lib/validate";
import {getTokenMarketSnapshot} from "../../../../../../lib/integrations/token-market";
import {enforceRateLimit} from "../../../../../../lib/rate-limit-response";
export async function GET(request:Request,{params}:{params:Promise<{mint:string}>}){try{const limited=await enforceRateLimit(request,"token.market",30);if(limited)return limited;const {mint}=await params;return json(await getTokenMarketSnapshot(requireSolanaAddress(mint,"mint")))}catch(e){return error("BAD_REQUEST",e instanceof Error?e.message:"Unable to load token market data",400)}}
