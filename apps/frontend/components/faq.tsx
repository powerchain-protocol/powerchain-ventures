import { ChevronDownIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";

const questions = [
  ["What is PowerChain Launchpad?", "PowerChain Launchpad is a wallet-controlled operating system for designing, validating, launching, monitoring, settling, vesting, claiming, and reporting tokenized capital launches."],
  ["How does wallet-controlled execution work?", "PowerChain prepares and validates transaction requests, but an authorized connected wallet reviews and signs each consequential on-chain action."],
  ["Does PowerChain store private keys?", "No. Private keys and seed phrases remain inside the user's wallet and are never requested or stored by the application."],
  ["Which blockchain is supported?", "This implementation is Solana-native and uses @solana/web3.js. Additional networks can be added as isolated adapters without changing the signing principle."],
  ["What types of projects can launch?", "Renewable energy, infrastructure, community funding, humanitarian initiatives, real-world asset programs, and tokenized crowdfunding can use the same lifecycle model."],
  ["How are fees structured?", "SaaS subscription pricing, Solana network fees, and any disclosed launch-specific service fee are shown separately so operators and participants understand what they are paying."],
  ["Can AI change launch settings?", "AI may analyze, recommend, or prepare changes for review. It does not silently alter critical launch configuration or sign transactions."],
  ["How does settlement work?", "Participation is accounted for by the launch program, then settlement follows configured rules into an authorized treasury with on-chain records and reconciliation."],
];

export function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="center-heading compact-heading">
          <span className="eyebrow"><QuestionMarkCircledIcon /> FAQ</span>
          <h2 className="section-title">Frequently asked questions</h2>
        </div>
        <div className="faq-grid">
          {questions.map(([question, answer]) => (
            <details className="faq-item" key={question}>
              <summary><span>{question}</span><ChevronDownIcon /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
