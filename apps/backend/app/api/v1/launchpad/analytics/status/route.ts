import {cdpSqlConfigured,runCdpSql} from "../../../../../../lib/cdp-sql";
import {errorFromUnknown,json,requestId} from "../../../../../../lib/http";
export const runtime="nodejs";
export async function GET(request:Request){const id=requestId(request);try{if(!cdpSqlConfigured())return json({ok:false,configured:false,beta:true},{status:503},id);const data=await runCdpSql<{one:number}>("SELECT 1 AS one",15000);return json({ok:true,configured:true,beta:true,metadata:data.metadata},{},id)}catch(e){return errorFromUnknown(e,id)}}
