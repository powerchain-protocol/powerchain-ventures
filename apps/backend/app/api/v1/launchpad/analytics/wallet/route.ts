import {analyticsBounds,runCdpSql,walletTransfersSql} from "../../../../../../lib/cdp-sql";
import {errorFromUnknown,json,requestId} from "../../../../../../lib/http";
export const runtime="nodejs";
export async function GET(request:Request){const id=requestId(request);try{const url=new URL(request.url),wallet=url.searchParams.get("wallet")??"",{days,limit}=analyticsBounds(url);const data=await runCdpSql(walletTransfersSql(wallet,days,limit),5000);return json({ok:true,beta:true,network:"solana-mainnet",wallet,days,transfers:data.result,metadata:data.metadata},{},id)}catch(e){return errorFromUnknown(e,id)}}
