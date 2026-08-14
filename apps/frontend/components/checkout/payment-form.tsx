"use client";
import {useState} from "react";
import type {CheckoutMethod} from "../../types/checkout";
import {PurchaseExperience,type PurchaseSettlementReceipt} from "../launchpad/purchase-experience";
import {CheckoutSuccess,type CheckoutReceipt} from "./checkout-success";
import {CreditCard} from "./credit-card";
import {Onramp} from "./onramp";
import {PaymentMethods} from "./payment-methods";

export function PaymentForm({saleId}:{saleId:string}){
 const [method,setMethod]=useState<CheckoutMethod>("wallet");
 const [receipt,setReceipt]=useState<CheckoutReceipt|null>(null);
 function handleSettled(value:PurchaseSettlementReceipt){setReceipt(value)}
 if(receipt)return <section className="checkout-payment-column"><CheckoutSuccess receipt={receipt} onReset={()=>setReceipt(null)}/></section>;
 return <section className="checkout-payment-column">
  <div className="checkout-section-title"><div><span className="eyebrow">Payment</span><h2>Choose how to participate</h2></div><span className="checkout-live-dot">Live</span></div>
  <PaymentMethods value={method} onChange={setMethod}/>
  {method==="wallet"&&<div className="checkout-wallet-method"><PurchaseExperience saleId={saleId} onSettled={handleSettled}/></div>}
  {method==="card"&&<section className="checkout-option-panel"><div className="checkout-option-heading"><div><span className="eyebrow">Card</span><h3>Secure provider checkout</h3></div><span className="checkout-method-state">Setup required</span></div><CreditCard/><div className="checkout-safe-note"><b>PCI-safe by design</b><span>Raw PAN, expiry and CVV inputs are intentionally not rendered by PowerChain. A configured PCI/tokenization provider must own those fields.</span></div><button className="button-framed" type="button" disabled>Card provider not configured</button></section>}
  {method==="onramp"&&<Onramp saleId={saleId}/>}
 </section>
}
