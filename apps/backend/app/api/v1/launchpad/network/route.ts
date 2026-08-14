import {json,error} from "../../../../../lib/http";
import {mainnetInfrastructureConfigured,verifyNetworkIdentity} from "../../../../../lib/solana-network";
export const runtime="nodejs";
export async function GET(){
 try{const identity=await verifyNetworkIdentity();const infra=mainnetInfrastructureConfigured();return json({ok:identity.verified&&infra.ok,network:identity,infra,tokenProgram:"Token-2022",commitment:"confirmed",productionIdentityRequired:identity.cluster==="mainnet-beta"});}
 catch(e){return error("RPC_UNAVAILABLE",e instanceof Error?e.message:"Unable to verify Solana network identity",503)}
}
