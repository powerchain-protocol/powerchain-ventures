import Link from "next/link";
import {PwrcCoin} from "../pwrc-coin";
import {PaymentForm} from "./payment-form";
import {ShieldIcon,SolanaIcon} from "./checkout-icons";

export function Checkout({saleId}:{saleId:string}){
 return <main className="page powerchain-checkout-page">
  <header className="checkout-product-header"><div className="checkout-product-brand"><PwrcCoin size={44}/><div><b>PowerChain Checkout</b><span>Secure Token Sale Payment</span></div></div><div className="checkout-security-badges"><span><ShieldIcon/>Wallet custody</span><span><ShieldIcon/>Exact review</span><span><ShieldIcon/>On-chain verify</span></div><Link className="button-white checkout-close" href={`/sales/${saleId}`} aria-label="Close checkout">×</Link></header>
  <div className="checkout-enterprise-shell">
   <aside className="checkout-order-column">
    <section className="checkout-framed-card merchant-card"><div className="merchant-logo"><PwrcCoin size={46}/></div><div><span className="eyebrow">Verified issuer</span><h3>PowerChain</h3><p>PWRC Token-2022 sale on Solana Mainnet.</p></div><span className="verified-merchant">✓ Verified</span></section>
    <section className="checkout-framed-card"><span className="eyebrow">Order security</span><h3>Review before signing</h3><ol className="checkout-step-list"><li><b>1</b><span>Server quote</span></li><li><b>2</b><span>Exact Solana instructions</span></li><li><b>3</b><span>Your wallet signature</span></li><li><b>4</b><span>On-chain settlement verification</span></li></ol></section>
    <section className="checkout-protection-card"><ShieldIcon/><div><b>Protected by PowerChain</b><span>Simulation · eligibility · fee policy · delivery verification</span></div></section>
   </aside>
   <PaymentForm saleId={saleId}/>
   <aside className="checkout-route-column">
    <section className="checkout-framed-card"><div className="checkout-section-title compact"><div><span className="eyebrow">Optimized route</span><h3>Solana settlement</h3></div><span className="checkout-ai-pill">Safe</span></div><div className="checkout-route"><span><SolanaIcon/>Solana Mainnet</span><i>↓</i><span><ShieldIcon/>Transaction simulation</span><i>↓</i><span><ShieldIcon/>Exact message binding</span><i>↓</i><span><PwrcCoin size={24}/>PWRC delivery</span></div></section>
    <section className="checkout-framed-card"><span className="eyebrow">PowerChain guarantees</span><ul className="checkout-feature-list"><li><i>✓</i>2.5% purchase fee shown separately</li><li><i>✓</i>No private keys or seed phrases</li><li><i>✓</i>Token-2022 destination verified</li><li><i>✓</i>Signature matched to reviewed message</li><li><i>✓</i>Receipt retained in Transaction Center</li></ul></section>
    <Link className="button-white checkout-back-link" href={`/sales/${saleId}`}>← Back to sale details</Link>
   </aside>
  </div>
 </main>
}
