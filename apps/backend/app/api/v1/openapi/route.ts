import {readFile} from "node:fs/promises";
import path from "node:path";
import {error} from "../../../../lib/http";

export const runtime="nodejs";
export async function GET(){
 try{
  const file=path.join(process.cwd(),"openapi","powerchain-launchpad.openapi.yaml");
  const spec=await readFile(file,"utf8");
  return new Response(spec,{status:200,headers:{"content-type":"application/yaml; charset=utf-8","cache-control":"public, max-age=300","x-content-type-options":"nosniff"}});
 }catch(cause){return error("INTERNAL_ERROR",cause instanceof Error?cause.message:"OpenAPI document unavailable",500)}
}
