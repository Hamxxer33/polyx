// Client-only entry: AppKit (Lit web components) cannot be evaluated during SSR,
// so the wallet stack is loaded after hydration via React.lazy in routes/check.tsx.
import { WalletProviders } from "@/components/providers";
import { Checker } from "@/components/checker";

export default function CheckerClient({ demo, wallet }: { demo: boolean; wallet?: string }) {
  return (
    <WalletProviders demo={demo}>
      <Checker demo={demo} initialWallet={wallet} />
    </WalletProviders>
  );
}
