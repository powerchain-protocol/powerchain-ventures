import { UiError } from "./errors";
const forbidden=["privateKey","secretKey","seed","mnemonic"];
export function assertBrowserSafePayload(value:unknown){const text=JSON.stringify(value??{});if(forbidden.some((key)=>text.includes(`\"${key}\"`)))throw new UiError("secret_material_rejected","Secret wallet material must never be sent to PowerChain.")}
