import {AppShell} from "../../components/app-shell";
import {ClaimCenter} from "../../components/launchpad/claim-center";
export default function Claims(){return <AppShell><main className="page"><span className="eyebrow">Claim center</span><h1>Claim vested tokens</h1><p className="lead">See your exact vesting schedule, vested balance, previously claimed amount and what is available now. Every claim is reviewed before your wallet is asked to sign.</p><ClaimCenter/></main></AppShell>}
