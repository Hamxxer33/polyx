import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal";
import { CHAIN, PROJECT } from "@/config/polyx";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: `Privacy · ${PROJECT.name}` }] }),
  component: () => (
    <LegalPage
      title="Privacy"
      intro={`${PROJECT.operator} runs ${PROJECT.domain}. We collect as little as possible: a public wallet address when you choose to submit one, and nothing else that identifies you.`}
      sections={[
        { h: "What we collect", body: <><p>When you check a wallet, the address is sent to our server only to read public {CHAIN.longName} data. We do not store checked addresses.</p><p>When you submit a wallet, we store that public address and its estimated allocation so it can be included in the final list.</p></> },
        { h: "What we never collect", body: <p>No names, emails, seed phrases, private keys or signatures. Connecting a wallet only shares its public address with this page.</p> },
        { h: "Stored in your browser", body: <p>Your completed community steps and whether you submitted are saved in your own browser (local storage) so the page remembers your progress. Clearing site data removes them.</p> },
        { h: "Third parties", body: <p>We use an RPC provider to read the chain, Google Forms to record submitted wallets, WalletConnect (Reown) when you connect a wallet, and our hosting provider. Each processes data under its own policy.</p> },
        { h: "Public by nature", body: <p>Wallet addresses and on-chain activity are public on {CHAIN.longName}. Linking a wallet to your social accounts, for example by sharing your allocation, may make it identifiable.</p> },
        { h: "Retention and your choices", body: <p>Submitted addresses are kept until the distribution ends and any claim window closes. You can ask us to remove a submitted address through our official channels.</p> },
      ]}
    />
  ),
});
