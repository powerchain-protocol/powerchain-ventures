import {json} from "../../../../lib/http";
export const runtime = "nodejs";
export function GET(){return json({ok:true,service:"powerchain-launchpad-backend",version:"1.0.0",time:new Date().toISOString()});}
