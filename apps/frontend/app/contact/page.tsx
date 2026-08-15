import type { Metadata } from "next";
import { ContactForm } from "../../components/contact/contact-form";
import { Card, CardBody, CardHeader } from "../../components/ui/card";

export const metadata: Metadata = {
  title: "Contact PowerChain",
  description:
    "Contact PowerChain Launchpad product, technical and launch support.",
};

export default function ContactPage() {
  return (
    <main className="page contact-page">
      <section className="contact-hero">
        <div>
          <span className="eyebrow">Contact</span>
          <h1>Talk to PowerChain.</h1>
          <p>
            Product questions, launch support, integrations, partnerships and
            technical issues—send the right context and the team can respond
            efficiently.
          </p>
        </div>
        <div className="contact-response-card">
          <strong>Support scope</strong>
          <span>Launchpad · Wallets · API · Token-2022 · Integrations</span>
        </div>
      </section>

      <section className="contact-layout">
        <Card className="contact-form-card">
          <CardHeader
            eyebrow="Message"
            title="How can we help?"
            description="Include the sale ID or transaction signature when it helps identify the issue."
          />
          <CardBody>
            <ContactForm />
          </CardBody>
        </Card>

        <aside className="contact-side">
          <Card>
            <CardHeader
              eyebrow="Security"
              title="Never share wallet secrets"
              description="PowerChain support will never ask for a seed phrase or private key."
            />
          </Card>
          <Card>
            <CardHeader
              eyebrow="Developers"
              title="API documentation"
              description="Check API v1 and OpenAPI documentation before reporting an integration issue."
            />
            <CardBody>
              <a className="pc-inline-link" href="/docs/api">
                Open developer documentation →
              </a>
            </CardBody>
          </Card>
        </aside>
      </section>
    </main>
  );
}
