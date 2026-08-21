import { CheckCircledIcon, LockClosedIcon } from "@radix-ui/react-icons";

const lifecycle = ["Discover","Design","Configure","Validate","Review","Launch","Monitor","Settle","Vest","Claim","Report"];

export function LaunchLifecycle() {
  return <section className="lifecycle-section" aria-labelledby="launch-lifecycle-title"><div className="container">
    <div className="lifecycle-heading"><div><span className="eyebrow"><CheckCircledIcon/> Complete lifecycle</span><h2 id="launch-lifecycle-title">One operating layer from launch design to reporting.</h2></div><p>Every consequential action follows the same controlled path: configure, validate, review, simulate, approve, sign, confirm, and record.</p></div>
    <ol className="lifecycle-rail">{lifecycle.map((item,index)=><li key={item} className={index < 5 ? "complete" : index === 5 ? "active" : ""}><span className="lifecycle-index">{String(index+1).padStart(2,"0")}</span><strong>{item}</strong><i/></li>)}</ol>
    <div className="lifecycle-boundary"><LockClosedIcon/><span><strong>Wallet-controlled execution</strong><small>AI prepares and PowerChain orchestrates. Only authorized wallets can sign.</small></span></div>
  </div></section>;
}
