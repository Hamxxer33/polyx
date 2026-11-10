import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal";
import { CHAIN, PROJECT, TOKEN } from "@/config/polyx";

const op = PROJECT.operator;

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: `Terms of use · ${PROJECT.name}` }] }),
  component: () => (
    <LegalPage
      title="Terms of use"
      intro={`These terms cover your use of the ${PROJECT.name} website at ${PROJECT.domain}, including the allocation checker and wallet submission. The site is operated by ${op}. By using it you agree to these terms.`}
      sections={[
        { h: "Who we are", body: <p>{PROJECT.name} is a community token project operated by {op} ("we", "us"). References to {TOKEN.symbol} mean the {PROJECT.name} token, once deployed.</p> },
        { h: "Estimates, not promises", body: <><p>The checker shows an estimate calculated from public {CHAIN.longName} data and the rates published on this site at the time you check. It is not an offer, a contract or a guarantee that you will receive any tokens.</p><p>Final allocations are fixed at the snapshot. We may change rates, caps, eligibility rules, dates or the distribution itself, or cancel it, at any time and for any reason, including to remove wallets we reasonably believe are automated, duplicated, sybil or otherwise abusing the program.</p></> },
        { h: "Eligibility", body: <p>You must be legally able to take part where you live. The program is not available to persons in jurisdictions where it would be unlawful, or to persons on sanctions lists. You are responsible for any taxes that apply to you.</p> },
        { h: "Wallet submission", body: <p>Submitting a wallet only records a public address. It never requires a signature, approval or payment. Anyone asking you to pay, sign or share a seed phrase in our name is not us.</p> },
        { h: "No financial advice", body: <p>Nothing on this site is investment, financial, legal or tax advice. Digital assets are volatile and may lose all value. Do your own research.</p> },
        { h: "Your responsibilities", body: <p>You are responsible for the security of your wallet and keys. Do not use the site for anything unlawful, and do not attempt to disrupt it, scrape it at scale or game the allocation.</p> },
        { h: "No warranty, limited liability", body: <p>The site is provided "as is" without warranties of any kind. To the fullest extent allowed by law, {op} is not liable for indirect or consequential losses, lost profits, or losses caused by blockchain networks, wallets, RPC providers or third-party services.</p> },
        { h: "Changes", body: <p>We may update these terms. The date at the top shows the latest version. Continuing to use the site means you accept the updated terms.</p> },
        { h: "Contact", body: <p>{PROJECT.contactEmail ? <>Questions about these terms: <a className="text-fg underline underline-offset-4" href={`mailto:${PROJECT.contactEmail}`}>{PROJECT.contactEmail}</a>.</> : <>Questions about these terms can be sent through our official channels.</>}</p> },
      ]}
    />
  ),
});
