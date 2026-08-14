import {secureSecretEqual} from "./auth-secret";

export function reconciliationSecret(){
 return process.env.CRON_SECRET||process.env.RECONCILIATION_SECRET||"";
}
export function reconciliationAuthorized(req:Request){
 const secret=reconciliationSecret();
 return Boolean(secret)&&secureSecretEqual(req.headers.get("authorization"),`Bearer ${secret}`);
}
