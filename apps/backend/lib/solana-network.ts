import {solanaRpc,rpcEndpoints} from "./solana-rpc";

export const MAINNET_GENESIS_PREFIX="5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";
export type NetworkIdentity={cluster:"devnet"|"mainnet-beta";genesisHash:string;slot:number;blockHeight:number;version:string;endpoint:string;latencyMs:number;verified:boolean};

export function configuredCluster():"devnet"|"mainnet-beta" {
 return process.env.NEXT_PUBLIC_SOLANA_CLUSTER==="devnet"?"devnet":"mainnet-beta";
}
export function expectedGenesisPrefix(){
 return (process.env.SOLANA_EXPECTED_GENESIS_PREFIX??(configuredCluster()==="mainnet-beta"?MAINNET_GENESIS_PREFIX:"")).trim();
}
export function isPublicMainnetRpc(url:string){try{return new Set(["api.mainnet.solana.com","api.mainnet-beta.solana.com"]).has(new URL(url).hostname)}catch{return true}}

export async function verifyNetworkIdentity():Promise<NetworkIdentity>{
 const cluster=configuredCluster();
 const genesis=await solanaRpc<string>("getGenesisHash");
 const expected=expectedGenesisPrefix();
 if(expected&&!genesis.result.startsWith(expected)) throw new Error(`solana_cluster_identity_mismatch:${genesis.result}`);
 if(cluster==="mainnet-beta"&&!genesis.result.startsWith(MAINNET_GENESIS_PREFIX)) throw new Error("solana_mainnet_identity_mismatch");
 const [slot,height,version]=await Promise.all([
  solanaRpc<number>("getSlot",[{commitment:"confirmed"}]),
  solanaRpc<number>("getBlockHeight",[{commitment:"confirmed"}]),
  solanaRpc<{"solana-core"?:string}>("getVersion")
 ]);
 return {cluster,genesisHash:genesis.result,slot:slot.result,blockHeight:height.result,version:version.result["solana-core"]??"unknown",endpoint:genesis.endpoint,latencyMs:genesis.latencyMs,verified:true};
}

export function mainnetInfrastructureConfigured(){
 const endpoints=rpcEndpoints();
 if(configuredCluster()!=="mainnet-beta") return {ok:true,dedicated:true,redundant:endpoints.length>0,count:endpoints.length};
 return {ok:endpoints.length>=2&&!endpoints.some(e=>isPublicMainnetRpc(e.url)),dedicated:!endpoints.some(e=>isPublicMainnetRpc(e.url)),redundant:endpoints.length>=2,count:endpoints.length};
}
