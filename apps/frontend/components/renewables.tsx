import Link from "next/link";
import { ArrowRightIcon, CheckCircledIcon, LightningBoltIcon } from "@radix-ui/react-icons";

export function Renewables() {
  return (
    <section id="renewables" className="renewables-hero surface-green">
      <div className="renewables-overlay" />
      <div className="container renewables-content">
        <span className="eyebrow eyebrow-light"><LightningBoltIcon /> Renewables at the core</span>
        <h2>Powering a sustainable future with transparent capital.</h2>
        <p>PowerChain gives renewable energy teams a wallet-controlled operating layer for transparent funding, global participation, impact visibility, and on-chain settlement.</p>
        <div className="renewables-points">
          {["Transparent funding", "Impact tracking", "Global accessibility", "Community participation", "On-chain accountability", "Lifecycle reporting"].map((item) => <span key={item}><CheckCircledIcon /> {item}</span>)}
        </div>
        <Link href="/renewables" className="button button-on-green">Explore renewable launches <ArrowRightIcon /></Link>
      </div>
    </section>
  );
}
