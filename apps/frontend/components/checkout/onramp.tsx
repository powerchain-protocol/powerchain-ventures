"use client";
import {useEffect,useMemo,useState} from "react";
import {useAccount} from "@solana/connector";
import {PwrcCoin} from "../pwrc-coin";
import {SolanaIcon} from "./checkout-icons";

const PRESETS=[50,100,250,500] as const;
type ProviderStatus={enabled:boolean;configured:boolean};
type Tx={status?:string|null;purchaseAmount?:{value?:string;currency?:string}|null;paymentTotal?:{value?:string;currency?:string}|null;coinbaseFee?:{value?:string;currency?:string}|null;networkFee?:{value?:string;currency?:string}|null;txHash?:string|null;createdAt?:string|null};
export function Onramp({saleId}:{saleId:string}){
 const account=useAccount();const wallet=account?String(account):"";
 const [amount,setAmount]=useState("100"),[busy,setBusy]=useState(false),[error,setError]=useState(""),[ref,setRef]=useState(""),[provider,setProvider]=useState<ProviderStatus|null>(null),[transactions,setTransactions]=useState<Tx[]>([]);
 useEffect(()=>{try{setRef(localStorage.getItem("powerchain.onramp.partnerUserRef")||"")}catch{};void fetch("/api/v1/onramp/status",{cache:"no-store"}).then(r=>r.json()).then(setProvider).catch(()=>setProvider({enabled:false,configured:false}))},[]);
 const valid=useMemo(()=>/^\d+(?:\.\d{0,2})?$/.test(amount)&&Number(amount)>=5,[amount]);
 async function start(){if(!wallet||!valid||!provider?.configured)return;setBusy(true);setError("");try{const r=await fetch("/api/v1/onramp/session",{method:"POST",headers:{"content-type":"application/json","idempotency-key":crypto.randomUUID()},body:JSON.stringify({wallet,saleId,paymentAmount:Number(amount).toFixed(2)})});const j=await r.json();if(!r.ok)throw new Error(j?.error?.message||"Unable to create Coinbase Onramp session");setRef(j.partnerUserRef);localStorage.setItem("powerchain.onramp.partnerUserRef",j.partnerUserRef);const w=window.open(j.onrampUrl,"_blank","noopener,noreferrer");if(!w)window.location.assign(j.onrampUrl)}catch(e){setError(e instanceof Error?e.message:"Unable to start Onramp")}finally{setBusy(false)}}
 async function refresh(){if(!ref)return;setBusy(true);setError("");try{const r=await fetch(`/api/v1/onramp/transactions?partnerUserRef=${encodeURIComponent(ref)}&pageSize=10`,{cache:"no-store"});const j=await r.json();if(!r.ok)throw new Error(j?.error?.message||"Unable to load Onramp status");setTransactions(Array.isArray(j.transactions)?j.transactions:[])}catch(e){setError(e instanceof Error?e.message:"Unable to load Onramp status")}finally{setBusy(false)}}
 const latest=transactions[0],success=latest?.status==="ONRAMP_TRANSACTION_STATUS_SUCCESS";
 return <section className="checkout-option-panel onramp-provider-panel">
  <div className="checkout-option-heading"><span className="checkout-option-symbol"><SolanaIcon/></span><div><span className="eyebrow">Coinbase-hosted Onramp</span><h3>Fund your Solana wallet</h3></div><span className={`checkout-method-state ${provider?.configured?"ready":""}`}>{provider===null?"Checking…":provider.configured?"Ready":"Setup required"}</span></div>
  <p>Buy SOL with your Coinbase account and supported linked payment methods. SOL is sent directly to your connected wallet; return to PowerChain to review and sign the PWRC sale transaction.</p>
  <div className="onramp-route"><span>Fiat</span><i>→</i><span>Coinbase</span><i>→</i><span>SOL wallet</span><i>→</i><span className="pwrc-route"><PwrcCoin size={24}/> PWRC checkout</span></div>
  <div className="onramp-amount-block"><label htmlFor="onramp-amount">Amount to fund <span>USD</span></label><div className="amount"><span>$</span><input id="onramp-amount" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} aria-describedby="onramp-help"/></div><div className="quick-amounts">{PRESETS.map(v=><button type="button" key={v} className={amount===String(v)?"active":""} onClick={()=>setAmount(String(v))}>${v}</button>)}</div><small id="onramp-help">Coinbase determines availability, limits, exchange rate and Coinbase/network fees before you confirm there.</small></div>
  <div className="checkout-safe-note"><b>Non-custodial destination</b><span>PowerChain never receives your Coinbase credentials or card data. Purchased SOL is directed to <code>{wallet?`${wallet.slice(0,6)}…${wallet.slice(-6)}`:"your connected wallet"}</code>.</span></div>
  <div className="checkout-safe-note warning"><b>Hosted guest checkout retired</b><span>Debit-card / Apple Pay guest checkout is no longer offered through the hosted widget. This method is the Coinbase-account hosted flow; native Apple Pay/Google Pay belongs on Coinbase Headless Onramp.</span></div>
  {!provider?.configured&&provider!==null&&<div className="notice warning-notice">Set <code>CDP_ONRAMP_ENABLED=true</code>, CDP Secret API credentials, and an allowlisted redirect URL on the backend to enable this method.</div>}
  {error&&<div className="notice danger-notice">{error}</div>}
  {latest&&<div className={`notice ${success?"success-card":""}`}><b>{success?"SOL funding completed":"Coinbase funding status"}</b><span>{String(latest.status||"Unknown status").replaceAll("ONRAMP_TRANSACTION_STATUS_","").replaceAll("_"," ")}{latest.purchaseAmount?.value?` · ${latest.purchaseAmount.value} ${latest.purchaseAmount.currency||"SOL"}`:""}</span>{latest.paymentTotal?.value&&<small>Paid {latest.paymentTotal.value} {latest.paymentTotal.currency||"USD"}{latest.coinbaseFee?.value?` · Coinbase fee ${latest.coinbaseFee.value}`:""}{latest.networkFee?.value?` · network fee ${latest.networkFee.value}`:""}</small>}{latest.txHash&&<a href={`https://explorer.solana.com/tx/${encodeURIComponent(latest.txHash)}`} target="_blank" rel="noreferrer">View funding transaction ↗</a>}</div>}
  {!wallet&&<div className="notice warning-notice">Connect the Solana wallet you want Coinbase to fund.</div>}
  <div className="onramp-actions"><button className="primary" type="button" disabled={!wallet||!valid||busy||!provider?.configured} onClick={start}>{busy?"Preparing…":"Continue with Coinbase"}</button><button className="button-framed" type="button" disabled={busy||!ref||!provider?.configured} onClick={refresh}>Refresh funding status</button></div>
 </section>
}
