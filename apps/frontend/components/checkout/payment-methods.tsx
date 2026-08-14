"use client";
import type {CheckoutMethod} from "../../types/checkout";
import {CHECKOUT_METHODS} from "../../types/checkout";
import {CardIcon,OnrampIcon,WalletIcon} from "./checkout-icons";

const icons={wallet:<WalletIcon/>,card:<CardIcon/>,onramp:<OnrampIcon/>};

export function PaymentMethods({value,onChange}:{value:CheckoutMethod;onChange:(method:CheckoutMethod)=>void}){
 return <div className="checkout-method-tabs" role="tablist" aria-label="Payment method">
  {CHECKOUT_METHODS.map(method=><button key={method.id} type="button" role="tab" aria-selected={value===method.id} className={value===method.id?"active":""} onClick={()=>onChange(method.id)}>
   {icons[method.id]}<span><b>{method.label}</b><small>{method.description}</small></span>{method.badge&&<em>{method.badge}</em>}<i className={`method-readiness ${method.id==="wallet"?"ready":"setup"}`} aria-hidden="true"/>
  </button>)}
 </div>
}
