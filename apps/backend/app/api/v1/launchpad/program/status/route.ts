import {json} from "../../../../../../lib/http";
import {getLaunchpadProgramStatus} from "../../../../../../lib/program/status";

export async function GET(){return json({program:await getLaunchpadProgramStatus()})}
