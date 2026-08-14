const SOLANA=/^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
export async function POST(req:Request){const body=await req.json().catch(()=>null) as {wallet?:unknown}|null;const wallet=typeof body?.wallet==="string"?body.wallet.trim():"";if(!SOLANA.test(wallet))return Response.json({eligible:false,error:"invalid_wallet"},{status:400});return Response.json({eligible:true,mode:"public",wallet})}
