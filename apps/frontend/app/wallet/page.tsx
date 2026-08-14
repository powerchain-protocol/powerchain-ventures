import {AppShell} from "../../components/app-shell";
import {WalletCenter} from "../../components/wallet/wallet-center";
export default function WalletPage(){return <AppShell><main className="page"><div className="page-heading"><div><span className="eyebrow">PowerChain Wallet</span><h1>Assets & transfers</h1><p>View PWRC and SOL balances, market conversion estimates and send assets with exact transaction review.</p></div></div><WalletCenter/></main></AppShell>}
