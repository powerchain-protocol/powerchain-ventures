import Link from "next/link";
import { AppShell } from "../app-shell";

type InfoSection = {
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
};

export function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
}) {
  return (
    <AppShell>
      <main className="page info-page">
        <div className="page-heading">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
        </div>
        <div className="info-grid">
          {sections.map((section) => (
            <section className="panel info-panel" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.href && section.hrefLabel && <Link className="text-link" href={section.href}>{section.hrefLabel} →</Link>}
            </section>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
