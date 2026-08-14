import {AppShell} from "../../components/app-shell";
import {CreatorSaleWizard} from "../../components/launchpad/creator-sale-wizard";
export default function Create(){return <AppShell><main className="page"><span className="eyebrow">Creator console</span><h1>Create a token sale</h1><p className="lead">Create a PowerChain Launchpad sale end-to-end: validate the Token-2022 mint, define exact pricing and allocation, schedule phases, configure eligibility and vesting, then review every Solana instruction before activation.</p><CreatorSaleWizard/></main></AppShell>}
