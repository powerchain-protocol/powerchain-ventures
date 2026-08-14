import {AppShell} from "../../../components/app-shell";
import {Checkout} from "../../../components/checkout/checkout";

export default async function CheckoutPage({params}:{params:Promise<{saleId:string}>}){
 const {saleId}=await params;
 return <AppShell><Checkout saleId={saleId}/></AppShell>;
}
