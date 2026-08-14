import Link from "next/link";
import {PwrcCoin} from "../pwrc-coin";
import {ShieldIcon} from "./checkout-icons";

export type CheckoutReceipt = {
  saleId: string;
  signature: string;
  wallet: string;
  settledAt: string;
};

function short(value:string){return value.length>18?`${value.slice(0,8)}…${value.slice(-8)}`:value}

export function CheckoutSuccess({receipt,onReset}:{receipt:CheckoutReceipt;onReset:()=>void}){
 return <section className="checkout-success" aria-live="polite">
  <div className="checkout-success-mark" aria-hidden="true">✓</div>
  <PwrcCoin size={58}/>
  <span className="eyebrow">Settlement verified</span>
  <h2>Purchase successful</h2>
  <p>PowerChain verified the signed Solana transaction and recorded the purchase settlement. Token delivery follows the sale&apos;s configured delivery mode.</p>
  <div className="checkout-success-timeline" aria-label="Purchase completion steps">
   <div className="complete"><i>✓</i><span><b>Wallet signature</b><small>Accepted</small></span></div>
   <div className="complete"><i>✓</i><span><b>Solana confirmation</b><small>Verified</small></span></div>
   <div className="complete"><i>✓</i><span><b>Settlement policy</b><small>Passed</small></span></div>
   <div className="complete"><i>✓</i><span><b>Receipt</b><small>Recorded</small></span></div>
  </div>
  <div className="checkout-receipt-card">
   <div><span>Transaction</span><a href={`https://explorer.solana.com/tx/${receipt.signature}`} target="_blank" rel="noreferrer"><code>{short(receipt.signature)}</code> ↗</a></div>
   <div><span>Wallet</span><code>{short(receipt.wallet)}</code></div>
   <div><span>Completed</span><strong>{new Date(receipt.settledAt).toLocaleString()}</strong></div>
   <div><span>Protection</span><strong className="receipt-protected"><ShieldIcon/> Exact message verified</strong></div>
  </div>
  <div className="checkout-success-actions">
   <Link className="primary" href="/transactions">View transaction receipt</Link>
   <Link className="button-white" href={`/sales/${receipt.saleId}`}>Back to sale</Link>
   <button className="button-white" type="button" onClick={onReset}>Make another purchase</button>
  </div>
 </section>
}
