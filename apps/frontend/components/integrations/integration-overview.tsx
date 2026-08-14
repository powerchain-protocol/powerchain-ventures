"use client";

import {useEffect,useState} from "react";
import {fetchJson,shortAddress} from "../../lib/helpers";
import {usePowerChainConfig} from "../../context/powerchain-config-context";

type Health={heliusConfigured:boolean;birdeyeConfigured:boolean;heliusRpcBase:string;birdeyeBaseUrl:string;heliusHealth?:unknown};
type Pwrc={symbol:string;mint:string;market:{priceUsd:number|null;liquidityUsd:number|null;observedAt:string;sources:{birdeye:boolean;helius:boolean}}};

export function IntegrationOverview(){
 const {config}=usePowerChainConfig();
 const [health,setHealth]=useState<Health|null>(null); const [pwrc,setPwrc]=useState<Pwrc|null>(null); const [error,setError]=useState<string|null>(null);
 useEffect(()=>{const c=new AbortController();Promise.allSettled([
  fetchJson<Health>("/api/v1/integrations/health",{signal:c.signal,retries:1,timeoutMs:8000}),
  fetchJson<Pwrc>("/api/v1/integrations/pwrc",{signal:c.signal,retries:1,timeoutMs:8000}),
 ]).then(([h,p])=>{if(c.signal.aborted)return;if(h.status==="fulfilled")setHealth(h.value);if(p.status==="fulfilled")setPwrc(p.value);if(h.status==="rejected"&&p.status==="rejected")setError("Provider data is temporarily unavailable. Launchpad settlement remains available through Solana RPC.")});return()=>c.abort()},[]);
 return <div className="integration-grid">
  <section className="panel integration-panel"><div className="panel-head"><div><span className="eyebrow">Network data</span><h2>Helius</h2></div><span className={`status ${health?.heliusConfigured?"success":"neutral"}`}>{health?.heliusConfigured?"Configured":"Optional"}</span></div><p>Server-side Solana RPC and DAS token metadata. Provider credentials never enter the browser.</p><dl className="integration-facts"><div><dt>RPC</dt><dd>{health?.heliusRpcBase??config?.integrations.heliusRpcBase??"Not configured"}</dd></div><div><dt>Settlement truth</dt><dd>Solana RPC verification</dd></div></dl></section>
  <section className="panel integration-panel"><div className="panel-head"><div><span className="eyebrow">Market intelligence</span><h2>Birdeye</h2></div><span className={`status ${health?.birdeyeConfigured?"success":"neutral"}`}>{health?.birdeyeConfigured?"Configured":"Optional"}</span></div><p>Price, liquidity and token overview data for display and analytics only. Market APIs never authorize settlement.</p><dl className="integration-facts"><div><dt>API</dt><dd>{health?.birdeyeBaseUrl??config?.integrations.birdeyeBaseUrl??"Not configured"}</dd></div><div><dt>Pricing role</dt><dd>Informational</dd></div></dl></section>
  <section className="panel integration-panel"><div className="panel-head"><div><span className="eyebrow">Settlement policy</span><h2>PowerChain fee</h2></div><span className="status success">2.5%</span></div><p>Purchase service fees are routed to the canonical PowerChain fee wallet and verified from the confirmed Solana transaction before settlement.</p><dl className="integration-facts"><div><dt>Fee wallet</dt><dd>{config?.feeWallet?<a href={`https://explorer.solana.com/address/${config.feeWallet}`} target="_blank" rel="noreferrer">{shortAddress(config.feeWallet,8)} ↗</a>:"Loading…"}</dd></div><div><dt>Claims</dt><dd>0% PowerChain fee</dd></div><div><dt>Launchpad program</dt><dd>{config?.launchpadProgramId?<a href={`https://explorer.solana.com/address/${config.launchpadProgramId}`} target="_blank" rel="noreferrer">{shortAddress(config.launchpadProgramId,8)} ↗</a>:"Deployment value required"}</dd></div></dl></section>
  <section className="panel integration-panel integration-pwrc"><div className="panel-head"><div><span className="eyebrow">PowerChain token</span><h2>PWRC</h2></div><span className={`status ${pwrc?"success":"neutral"}`}>{pwrc?"Mint configured":"Mint required"}</span></div>{pwrc?<><p className="lead-token"><strong>{shortAddress(pwrc.mint,8)}</strong><a href={`https://explorer.solana.com/address/${pwrc.mint}`} target="_blank" rel="noreferrer">View mint ↗</a></p><div className="stat-grid compact-stats"><div className="stat-card"><span>Price</span><strong>{pwrc.market.priceUsd==null?"—":`$${pwrc.market.priceUsd.toLocaleString(undefined,{maximumSignificantDigits:8})}`}</strong></div><div className="stat-card"><span>Liquidity</span><strong>{pwrc.market.liquidityUsd==null?"—":`$${Math.round(pwrc.market.liquidityUsd).toLocaleString()}`}</strong></div></div></>:<p>The canonical PWRC Token-2022 mint is intentionally unset until the real deployed mainnet mint is supplied in production configuration.</p>}{error&&<div className="notice">{error}</div>}</section>
 </div>
}
