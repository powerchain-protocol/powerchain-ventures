import {createHash,timingSafeEqual} from "node:crypto";
export function secureSecretEqual(actual:string|null,expected:string){
 if(!actual)return false;
 const a=createHash("sha256").update(actual).digest();
 const b=createHash("sha256").update(expected).digest();
 return timingSafeEqual(a,b);
}
