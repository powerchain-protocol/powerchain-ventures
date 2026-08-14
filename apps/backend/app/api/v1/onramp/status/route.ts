import {json} from "../../../../../lib/http";
import {cdpOnrampStatus} from "../../../../../lib/cdp-onramp";
export async function GET(){return json(cdpOnrampStatus())}
