import {AppShell} from "../../components/app-shell";
import {IntegrationOverview} from "../../components/integrations/integration-overview";
export default function IntegrationPage(){return <AppShell><main className="page"><div className="page-heading"><div><span className="eyebrow">Production integrations</span><h1>PowerChain data layer</h1><p>Solana RPC, Token-2022 metadata and market intelligence are isolated from settlement so provider outages cannot silently change financial truth.</p></div></div><IntegrationOverview/></main></AppShell>}
