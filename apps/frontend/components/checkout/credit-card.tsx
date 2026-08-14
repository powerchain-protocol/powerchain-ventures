import {PwrcCoin} from "../pwrc-coin";

export function CreditCard(){return <div className="powerchain-credit-card" aria-label="PowerChain secure card preview">
 <div className="credit-card-head"><PwrcCoin size={34}/><span>PowerChain</span><b>SECURE</b></div>
 <div className="credit-card-chip" aria-hidden="true"><i/><i/><i/></div>
 <div className="credit-card-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;8845</div>
 <div className="credit-card-foot"><span><small>CARDHOLDER</small><b>POWERCHAIN USER</b></span><span><small>EXPIRES</small><b>•• / ••</b></span><strong>VISA</strong></div>
 </div>}
