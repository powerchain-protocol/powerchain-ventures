import {analyticsBounds,runCdpSql,tokenInstructionsSql} from "../../../../../../lib/cdp-sql";
import {errorFromUnknown,json,requestId} from "../../../../../../lib/http";
export const runtime="nodejs";
export async function GET(request:Request){const id=requestId(request);try{const url=new URL(request.url),program=url.searchParams.get("program")??"token-2022",instruction=url.searchParams.get("instruction")??"transferChecked",{days,limit}=analyticsBounds(url);const data=await runCdpSql(tokenInstructionsSql(program,days,limit,instruction),5000);return json({ok:true,beta:true,network:"solana-mainnet",program,instruction,days,instructions:data.result,metadata:data.metadata},{},id)}catch(e){return errorFromUnknown(e,id)}}
