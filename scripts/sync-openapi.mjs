import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const canonical=path.join(root,"apps/backend/openapi/powerchain-launchpad.openapi.yaml");
const targets=[path.join(root,"apps/backend/openapi/swagger.yaml"),path.join(root,"openapi/openapi.yaml")];
const source=fs.readFileSync(canonical,"utf8");
const check=process.argv.includes("--check");
let ok=true;
for(const target of targets){
 if(check){if(!fs.existsSync(target)||fs.readFileSync(target,"utf8")!==source){console.error(`[openapi] out of sync: ${path.relative(root,target)}`);ok=false}}
 else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,source);console.log(`[openapi] synced ${path.relative(root,target)}`)}
}
if(check&&!ok)process.exit(1);
if(check)console.log("[openapi] generated copies match canonical backend spec");
