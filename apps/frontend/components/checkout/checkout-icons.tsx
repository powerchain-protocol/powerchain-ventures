import type {ReactNode} from "react";

type IconProps={children:ReactNode};
export function CheckoutIcon({children}:IconProps){return <span className="checkout-method-icon" aria-hidden="true">{children}</span>}
export function ShieldIcon(){return <CheckoutIcon>✓</CheckoutIcon>}
export function WalletIcon(){return <CheckoutIcon>◫</CheckoutIcon>}
export function CardIcon(){return <CheckoutIcon>▭</CheckoutIcon>}
export function OnrampIcon(){return <CheckoutIcon>↗</CheckoutIcon>}
export function SolanaIcon(){return <CheckoutIcon>◎</CheckoutIcon>}
