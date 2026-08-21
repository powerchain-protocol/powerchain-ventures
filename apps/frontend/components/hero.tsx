import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, CheckCircledIcon, LockClosedIcon, MagicWandIcon, RocketIcon, GlobeIcon, BarChartIcon } from "@radix-ui/react-icons";

const stats = [
  ["$428.5M+", "Capital raised"], ["124+", "Projects launched"], ["1.2M+", "Participants"], ["98.7%", "Success rate"], ["50+", "Countries"], ["Live", "On Solana"]
];

export function Hero(){return <section className="hero-section"><div className="hero-map" aria-hidden="true"/><div className="container hero-layout">
  <div className="hero-copy"><div className="hero-badges"><span className="eyebrow"><RocketIcon/> PowerChain Launchpad</span><span className="hero-new-pill">Tokenized Capital OS</span></div>
    <h1>Launch real-world projects. <span>Raise capital</span> on-chain. Stay in control.</h1>
    <p className="hero-lead">Design, configure, validate and operate transparent tokenized capital launches with wallet-controlled execution on Solana—from eligibility and pricing to settlement, vesting, claims and reporting.</p>
    <div className="hero-actions"><Link className="button button-primary button-lg" href="/launch/create">Create your launch <ArrowRightIcon/></Link><a className="button button-outline button-lg" href={process.env.NEXT_PUBLIC_MARKETPLACE_URL||"http://localhost:3001"}>Explore launches <ArrowRightIcon/></a></div>
    <div className="hero-proof"><span><CheckCircledIcon/> No-custody execution</span><span><CheckCircledIcon/> Pre-sign simulation</span><span><CheckCircledIcon/> On-chain audit trail</span></div>
    <div className="hero-trust-grid"><div><LockClosedIcon/><span><strong>Wallet controlled</strong><small>Your keys. Your authority.</small></span></div><div><MagicWandIcon/><span><strong>AI assisted</strong><small>Prepare and analyze. Never sign.</small></span></div><div><CheckCircledIcon/><span><strong>On-chain execution</strong><small>Reviewable and verifiable.</small></span></div></div>
  </div>
  <div className="hero-globe-wrap"><div className="globe-orbit globe-orbit-a"/><div className="globe-orbit globe-orbit-b"/><Image className="hero-globe" src="/assets/green-globe.png" alt="PowerChain global tokenized renewable energy network" width={760} height={730} priority/>
    <div className="hero-float-card hero-float-card-top"><span><BarChartIcon/> Launch readiness</span><strong>86%</strong><small>2 items need review</small></div>
    <div className="hero-float-card hero-float-card-bottom"><span><LockClosedIcon/> Execution</span><strong>Wallet controlled</strong><small>AI cannot sign</small></div>
    <div className="hero-float-card hero-float-card-side"><span><GlobeIcon/> Network</span><strong>Solana</strong><small>Operational</small></div>
  </div>
  <div className="hero-stats card-surface">{stats.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
</div></section>}
