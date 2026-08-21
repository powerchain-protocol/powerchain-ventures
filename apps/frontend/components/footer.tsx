import Link from "next/link";
import { GitHubLogoIcon, LinkedInLogoIcon, PaperPlaneIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Logo } from "@powerchain/components/logo";

const groups = [
  { title: "Product", links: [["Launchpad", "/"], ["Marketplace", process.env.NEXT_PUBLIC_MARKETPLACE_URL || "http://localhost:3001"], ["Products", "/products"], ["Pricing", "/pricing"]] },
  { title: "Resources", links: [["FAQ", "/#faq"], ["Renewables", "/renewables"], ["Partners", "/partners"], ["Status", "#"]] },
  { title: "Company", links: [["About", "/about"], ["Contact", "/about#contact"], ["Careers", "/about#careers"], ["Brand", "/about#brand"]] },
  { title: "Legal", links: [["Privacy", "/legal/privacy"], ["Terms", "/legal/terms"], ["Risk Disclosure", "/legal/risk-disclosure"], ["Legal", "/legal"]] }
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo tone="light" />
          <p>Wallet-controlled infrastructure for transparent tokenized capital and renewable energy launches.</p>
          <div className="footer-socials">
            <a href="#" aria-label="PowerChain on GitHub"><GitHubLogoIcon /></a>
            <a href="#" aria-label="PowerChain on LinkedIn"><LinkedInLogoIcon /></a>
            <a href="#" aria-label="PowerChain updates"><PaperPlaneIcon /></a>
          </div>
        </div>
        {groups.map((group) => (
          <div className="footer-column" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
          </div>
        ))}
        <div className="footer-newsletter">
          <h3>Stay in the PowerChain loop</h3>
          <p>Product updates, new launches, renewable project insights, and release notes.</p>
          <form className="newsletter-form">
            <input type="email" aria-label="Email address" placeholder="Email address" />
            <button className="button button-on-green" type="submit" aria-label="Subscribe"><ArrowRightIcon /></button>
          </form>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 PowerChain. All rights reserved.</span>
        <span>Security · API · Brand Assets · English</span>
      </div>
    </footer>
  );
}
