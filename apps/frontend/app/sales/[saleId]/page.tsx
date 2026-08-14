import {AppShell} from "../../../components/app-shell";
import {PurchaseExperience} from "../../../components/launchpad/purchase-experience";
import {NetworkStatus} from "../../../components/launchpad/network-status";
export default async function SalePage({params}:{params:Promise<{saleId:string}>}){const {saleId}=await params;return <AppShell><main className="page"><div className="sale-page-top"><a className="text-button" href="/sales">← All sales</a><NetworkStatus compact/></div><PurchaseExperience saleId={saleId}/></main></AppShell>}
