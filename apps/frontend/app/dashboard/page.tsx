import {AppShell} from "../../components/app-shell";
import {CreatorDashboard} from "../../components/launchpad/creator-dashboard";
export default function Dashboard(){return <AppShell><main className="page"><div className="page-heading"><div><span className="eyebrow">Creator console</span><h1>Sale dashboard</h1><p>Monitor confirmed allocation, participation, settlement, claims and lifecycle status for the connected creator wallet.</p></div><a className="primary link" href="/create">Create sale</a></div><CreatorDashboard/></main></AppShell>}
