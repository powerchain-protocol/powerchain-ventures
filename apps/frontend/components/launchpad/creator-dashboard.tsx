"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {useAccount} from "@solana/connector";
import {TransactionReview,type ReviewPlan} from "./transaction-review";
import {useSerializedTransactionSigner} from "./use-transaction-signer";


type Sale={id:string;slug:string;name:string;mint:string;symbol?:string;decimals?:number;phase:string;starts_at:string;ends_at:string;claim_starts_at:string;allocation_base_units:string;sale_pda:string|null;vault_authority_pda:string|null;launchpad_program_id:string|null;onchain_status:string|null;metrics:{raisedUsdMicros:string;soldBaseUnits:string;claimedBaseUnits:string;participants:number}};
type Payload={sales:Sale[];summary:{raisedUsdMicros:string;participants:number;saleCount:number;activeSales:number}};
type Action="cancel"|"complete"|"pause"|"resume";
type PendingAction={sale:Sale;action:Action;plan:ReviewPlan};
const USD=1_000_000n;
function usd(micros:string){const n=BigInt(micros||"0"),whole=n/USD,cents=((n%USD)/10_000n).toString().padStart(2,"0");return `$${whole.toLocaleString()}.${cents}`}
function token(v:string,d=9){const scale=10n**BigInt(d),n=BigInt(v||"0"),whole=n/scale,frac=(n%scale).toString().padStart(d,"0").replace(/0+$/,'');return `${whole.toLocaleString()}${frac?`.${frac.slice(0,4)}`:""}`}
function short(v:string){return v.length>12?`${v.slice(0,6)}…${v.slice(-5)}`:v}
function percent(s:Sale){const allocation=BigInt(s.allocation_base_units||"0"),sold=BigInt(s.metrics.soldBaseUnits||"0");if(allocation<=0n)return 0;return Math.min(100,Number(sold*1000n/allocation)/10)}
function actionLabel(action:Action){return action==="cancel"?"Cancel sale":action==="complete"?"Complete sale":action==="pause"?"Pause sale":"Resume sale"}

export function CreatorDashboard(){
 const account=useAccount(),txSigner=useSerializedTransactionSigner();const wallet=account.address?String(account.address):"";
 const [data,setData]=useState<Payload|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[pending,setPending]=useState<PendingAction|null>(null);
 const load=useCallback(async()=>{if(!wallet){setData(null);return}setBusy(true);setMessage("");try{const r=await fetch(`/api/v1/launchpad/sales?creatorWallet=${encodeURIComponent(wallet)}`,{cache:"no-store"});const j=await r.json();if(!r.ok)throw new Error(j?.error?.message||"Unable to load creator sales");setData(j)}catch(e){setMessage(e instanceof Error?e.message:"Unable to load creator sales")}finally{setBusy(false)}},[wallet]);
 useEffect(()=>{void load()},[load]);
 const totals=useMemo(()=>data?.summary??{raisedUsdMicros:"0",participants:0,saleCount:0,activeSales:0},[data]);

 async function prepareAction(sale:Sale,action:Action){
  setBusy(true);setMessage("");
  try{
   const programAction=action==="pause"||action==="resume";
   const url=programAction?"/api/v1/launchpad/program/operations/prepare":"/api/v1/launchpad/sales/action/prepare";
   const body=programAction?{creatorWallet:wallet,saleId:sale.id,operation:action}:{creatorWallet:wallet,saleId:sale.id,action};
   const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json","x-idempotency-key":`creator:${sale.id}:${action}`},body:JSON.stringify(body)});const j=await r.json();
   if(!r.ok)throw new Error(j?.error?.message||"Unable to prepare creator action");setPending({sale,action,plan:j.plan});
  }catch(e){setMessage(e instanceof Error?e.message:"Unable to prepare creator action")}finally{setBusy(false)}
 }
 async function confirmAction(){
  if(!pending?.plan.serializedTransactionBase64)return;setBusy(true);setMessage("");
  try{
   const signature=await txSigner.signAndSend(pending.plan.serializedTransactionBase64);let status="submitted";
   for(let i=0;i<8;i++){
    const programAction=pending.action==="pause"||pending.action==="resume";
    const url=programAction?"/api/v1/launchpad/program/operations/confirm":"/api/v1/launchpad/sales/action/confirm";
    const body=programAction?{creatorWallet:wallet,saleId:pending.sale.id,reviewId:pending.plan.id,signature,operation:pending.action}:{creatorWallet:wallet,saleId:pending.sale.id,reviewId:pending.plan.id,signature,action:pending.action};
    const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json","x-idempotency-key":`confirm:${pending.plan.id}`},body:JSON.stringify(body)});const j=await r.json();
    if(!r.ok)throw new Error(j?.error?.message||"Creator action failed");status=String(j.status??status);
    if(status==="confirmed"||status==="finalized"){setPending(null);await load();return}await new Promise(resolve=>setTimeout(resolve,1500));
   }
   setMessage(`Transaction ${short(signature)} is ${status}; PowerChain will keep reconciliation available from Transactions.`)
  }catch(e){setMessage(e instanceof Error?e.message:"Creator action transaction failed")}finally{setBusy(false)}
 }

 if(!wallet)return <section className="panel"><div className="empty"><strong>Connect your creator wallet</strong><p>The dashboard is scoped to the Solana wallet that owns each sale. Connect that wallet to manage on-chain operations.</p></div></section>;
 if(pending)return <div className="creator-review"><div className="panel wizard-review-summary"><span className="eyebrow">On-chain creator operation</span><h2>{actionLabel(pending.action)} · {pending.sale.name}</h2><p>The exact Launchpad program instruction, fee payer, accounts and Solana costs must be reviewed before your wallet signs.</p><div className="summary-chips"><span>{pending.sale.symbol||"Token"}</span><span>{pending.sale.phase}</span><span>{pending.sale.sale_pda?`PDA ${short(pending.sale.sale_pda)}`:"PDA unavailable"}</span></div></div><TransactionReview plan={pending.plan} onBack={()=>setPending(null)} onSubmit={confirmAction} submitting={busy} submitLabel={`Sign · ${actionLabel(pending.action)}`}/>{message&&<div className="notice danger-notice">{message}</div>}</div>;

 return <>
  <section className="stat-grid creator-stat-grid">
   <article className="stat-card"><span>Raised</span><strong>{usd(totals.raisedUsdMicros)}</strong><small>Confirmed purchases</small></article>
   <article className="stat-card"><span>Participants</span><strong>{totals.participants}</strong><small>Unique confirmed buyers</small></article>
   <article className="stat-card"><span>Sales</span><strong>{totals.saleCount}</strong><small>Creator-owned sales</small></article>
   <article className="stat-card"><span>Active lifecycle</span><strong>{totals.activeSales}</strong><small>Scheduled through claimable</small></article>
  </section>
  <section className="panel creator-sales-panel"><div className="panel-head"><div><span className="eyebrow">Creator operations</span><h2>Your sales</h2><p>Manage program state, allocation and settlement without exposing custody credentials.</p></div><div className="panel-actions"><Link className="secondary link" href="/create">New sale</Link><button className="secondary" onClick={()=>void load()} disabled={busy}>{busy?"Refreshing…":"Refresh"}</button></div></div>
   {message&&<div className="notice danger-notice">{message}</div>}
   {!busy&&data?.sales.length===0&&<div className="empty"><strong>No active sales for {short(wallet)}</strong><p>Create a Token-2022 sale, review its program PDAs, then sign the activation transaction.</p><Link href="/create" className="primary link">Create first sale</Link></div>}
   {!!data?.sales.length&&<div className="creator-sales-list">{data.sales.map(s=>{const sold=percent(s),paused=s.onchain_status==="paused",terminal=["cancelled","completed"].includes(s.phase);return <article className="creator-sale-row creator-sale-card" key={s.id}>
    <div className="creator-sale-main"><div className="sale-state-line"><span className={`status ${terminal?"neutral":paused?"warning":"success"}`}>{paused?"paused":s.phase}</span>{s.sale_pda&&<span className="program-chip">Program bound</span>}</div><h3>{s.name}</h3><p>{s.symbol||"Token"} · {short(s.mint)}</p><div className="sale-progress-compact"><span style={{width:`${sold}%`}}/><i>{sold.toFixed(1)}% sold</i></div>{s.sale_pda&&<div className="program-address-row"><span>Sale PDA</span><code title={s.sale_pda}>{short(s.sale_pda)}</code></div>}</div>
    <div className="creator-sale-metrics"><span><small>Raised</small><b>{usd(s.metrics.raisedUsdMicros)}</b></span><span><small>Participants</small><b>{s.metrics.participants}</b></span><span><small>Sold</small><b>{token(s.metrics.soldBaseUnits,s.decimals??9)}</b></span><span><small>Claimed</small><b>{token(s.metrics.claimedBaseUnits,s.decimals??9)}</b></span></div>
    <div className="creator-sale-actions"><Link className="secondary link" href={`/sales/${s.id}`}>View sale</Link>{!terminal&&s.sale_pda&&<button className="secondary" disabled={busy} onClick={()=>void prepareAction(s,paused?"resume":"pause")}>{paused?"Resume":"Pause"}</button>}{!terminal&&<button className="secondary danger-outline" disabled={busy} onClick={()=>void prepareAction(s,"cancel")}>Cancel</button>}{["ended","claimable"].includes(s.phase)&&<button className="primary" disabled={busy} onClick={()=>void prepareAction(s,"complete")}>Complete</button>}</div>
   </article>})}</div>}
  </section>
 </>;
}
