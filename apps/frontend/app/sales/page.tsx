import {AppShell} from "../../components/app-shell";
import {SaleCatalog} from "../../components/launchpad/sale-catalog";
import {NetworkStatus} from "../../components/launchpad/network-status";
export default function SalesPage(){return <AppShell><main className="page"><NetworkStatus/><div className="page-heading"><div><span className="eyebrow">PowerChain Launchpad</span><h1>Token sales</h1><p>Browse active, upcoming and completed Token-2022 sales with canonical on-chain settlement.</p></div><a className="primary link" href="/create">Create sale</a></div><SaleCatalog/></main></AppShell>}
