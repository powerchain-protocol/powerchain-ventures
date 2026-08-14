import {error,json} from "../../../../../lib/http";
import {enforceRateLimit} from "../../../../../lib/rate-limit-response";
import {requireSolanaAddress} from "../../../../../lib/validate";
import {getWalletAssetData} from "../../../../../lib/wallet-assets";
export async function GET(request:Request,{params}:{params:Promise<{wallet:string}>}){try{const limited=await enforceRateLimit(request,"wallet.assets",60);if(limited)return limited;const {wallet}=await params;return json(await getWalletAssetData(requireSolanaAddress(wallet,"wallet")))}catch(e){return error("BAD_REQUEST",e instanceof Error?e.message:"Unable to load wallet data",400)}}
