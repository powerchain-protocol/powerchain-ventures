"use client";
import {useEffect,useState} from "react";
import {formatUnits,formatUsdMicros} from "../../lib/format";
import {fetchJson} from "../../lib/helpers";
import {PwrcCoin} from "../pwrc-coin";

type Sale={id:string;name:string;symbol:string;decimals:number;phase:string;cluster?:string;genesis_hash?:string|null;starts_at:string;ends_at:string;price_usd_micros:string;allocation_base_units:string;eligibility_mode:string;metrics:{raisedUsdMicros:string;soldBaseUnits:string;participants:number}};
function phaseLabel(value:string){return value.charAt(0).toUpperCase()+value.slice(1)}
export function SaleCatalog({compact=false}:{compact?:boolean}){
 const [sales,setSales]=useState<Sale[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{let active=true;fetchJson<{sales:Sale[]}>("/api/v1/launchpad/catalog",{},"Unable to load sales").then(j=>{if(active)setSales(j.sales||[])}).catch(e=>active&&setError(e instanceof Error?e.message:"Unable to load sales")).finally(()=>active&&setLoading(false));return()=>{active=false}},[]);
 if(loading)return <section className="panel catalog-empty"><b>Loading token sales…</b><span>Refreshing canonical sale state.</span></section>;
 if(error)return <section className="panel catalog-empty danger-notice"><b>Sale data unavailable</b><span>{error}</span></section>;
 if(!sales.length)return <section className="panel catalog-empty"><b>No public sales yet</b><span>Creator sales will appear here after activation.</span><a className="secondary link" href="/create">Create a sale</a></section>;
 const shown=compact?sales.slice(0,3):sales;
 return <div className="catalog-grid">{shown.map(s=>{const sold=BigInt(s.metrics.soldBaseUnits||"0"),allocation=BigInt(s.allocation_base_units||"0");const pct=allocation?Number(sold*10_000n/allocation)/100:0;return <article className="catalog-card" key={s.id}><div className="row"><div><span className="eyebrow">{s.eligibility_mode} sale</span><h3>{s.name}</h3></div><span className={`status ${s.phase==="public"?"success":""}`}>{phaseLabel(s.phase)}</span></div><div className="catalog-token"><div className="catalog-token-name">{s.symbol==="PWRC"&&<PwrcCoin size={34}/>}<div><strong>{s.symbol}</strong><small className="chain-label">Solana Mainnet • Token-2022</small></div></div><span>{formatUsdMicros(s.price_usd_micros)} / token</span></div><div className="progress"><span style={{width:`${Math.min(100,pct)}%`}}/></div><div className="between"><span>{formatUnits(sold,s.decimals)} / {formatUnits(allocation,s.decimals)} {s.symbol}</span><strong>{pct.toFixed(2)}%</strong></div><div className="catalog-metrics"><span><small>Raised</small><b>{formatUsdMicros(s.metrics.raisedUsdMicros)}</b></span><span><small>Participants</small><b>{s.metrics.participants.toLocaleString()}</b></span><span><small>Ends</small><b>{new Date(s.ends_at).toLocaleDateString()}</b></span><span><small>Network</small><b>{s.cluster==="mainnet-beta"?"Mainnet":"Devnet"}</b></span></div><a className="primary link catalog-action" href={s.phase==="public"||s.phase==="private"?`/checkout/${s.id}`:`/sales/${s.id}`}>{s.phase==="public"||s.phase==="private"?"Continue to checkout":"View sale"}</a></article>})}</div>
}
