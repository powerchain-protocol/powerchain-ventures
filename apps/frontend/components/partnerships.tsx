import { GlobeIcon } from "@radix-ui/react-icons";

const partners = ["Solana", "Pyth", "Helius", "Jupiter", "Orca", "Streamflow", "CCTP", "Chainlink"];

export function Partnerships() {
  return (
    <section id="partners" className="section section-soft partnerships-section">
      <div className="container">
        <div className="center-heading compact-heading">
          <span className="eyebrow"><GlobeIcon /> Ecosystem</span>
          <h2 className="section-title">Built to connect with industry infrastructure.</h2>
          <p className="section-copy">A modular launch layer designed around Solana, market data, liquidity, vesting, payment, and oracle ecosystems.</p>
        </div>
        <div className="partner-row" aria-label="Technology ecosystem">
          {partners.map((partner) => <div className="partner-wordmark" key={partner}>{partner}</div>)}
        </div>
      </div>
    </section>
  );
}
