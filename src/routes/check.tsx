import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { lazy, Suspense, useEffect, useState } from "react";
import { Shield } from "@/components/icons";
import { CHAIN, NFT, NFT_LIVE, PROJECT, RATES, TBA, TOKEN } from "@/config/polyx";
import { DEMO_RATES } from "@/config/demo";
import { fmt } from "@/lib/format";

type Search = { wallet?: string; demo?: boolean };

export const Route = createFileRoute("/check")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    wallet: typeof s.wallet === "string" ? s.wallet : undefined,
    demo: s.demo === 1 || s.demo === "1" || s.demo === true ? true : undefined,
  }),
  head: () => ({ meta: [{ title: `Allocation checker · ${PROJECT.name}` }] }),
  component: CheckPage,
});

function CheckPage() {
  const { wallet, demo = false } = Route.useSearch();
  const rates = demo ? DEMO_RATES : RATES;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="relative overflow-x-clip">
      <SiteHeader cta={false} />
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[600px]" />
      <div className="pointer-events-none absolute top-[-240px] left-[10%] h-[500px] w-[700px] rounded-full bg-iris/10 blur-[120px]" />
      <main className="wrap relative grid grid-cols-1 gap-10 pt-8 pb-10 md:grid-cols-[0.85fr_1.15fr] md:gap-14 md:pt-16">
        <aside className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow rise">Allocation checker</p>
          <h1 className="h-display rise d1 mt-4 text-[38px] leading-[1.02] sm:text-[52px]">What is your wallet worth?</h1>
          <p className="rise d2 mt-5 max-w-md text-[16px] leading-relaxed text-muted">
            We read your transactions{NFT_LIVE ? ` and ${NFT.name} balance` : ""} from {CHAIN.longName} and apply the {PROJECT.name} rates. Nothing to sign, nothing to pay.
          </p>
          <div className="rise d3 mt-8 hidden overflow-hidden rounded-2xl border border-line md:block">
            <RateRow k="Per transaction" v={rates.perTx != null ? `${fmt(rates.perTx)} ${TOKEN.symbol}` : TBA} />
            <RateRow k="Per NFT" v={!NFT_LIVE && !demo ? "At NFT launch" : rates.perNft != null ? `${fmt(rates.perNft)} ${TOKEN.symbol}` : TBA} />
            <RateRow k="Transaction cap" v={rates.txCap != null ? fmt(rates.txCap) : "None"} />
            <RateRow k="Network" v={CHAIN.longName} />
          </div>
          <div className="rise d4 mt-6 flex gap-3 rounded-2xl border border-volt/15 bg-volt/[0.03] p-4 text-[13px] leading-relaxed text-muted">
            <Shield className="mt-0.5 size-5 shrink-0 text-volt" />
            <p>Official site: <span className="text-fg">{PROJECT.domain}</span>. This page never asks for a signature, a payment or your seed phrase.</p>
          </div>
        </aside>
        <div>
          {mounted ? (
            <Suspense fallback={<FlowSkeleton />}>
              <CheckerClient demo={demo} wallet={wallet} />
            </Suspense>
          ) : (
            <FlowSkeleton />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

const CheckerClient = lazy(() => import("@/components/checker-client"));

/** Server-rendered placeholder with the same footprint as step 1 while the wallet stack loads. */
function FlowSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <section className="panel p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-7 place-items-center rounded-full border border-volt/60 font-mono text-[12px] text-volt">1</span>
          <span className="text-[16px] font-medium">Your wallet</span>
        </div>
        <div className="field flex items-center text-faint">0x… paste any address</div>
        <div className="mt-2.5 h-4" />
        <div className="mt-5 grid gap-3">
          <div className="btn-volt h-[52px] w-full opacity-60">Check allocation</div>
        </div>
      </section>
    </div>
  );
}

function RateRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line bg-surface/50 px-5 py-3.5 text-[14px] last:border-b-0">
      <span className="text-muted">{k}</span>
      <span className="font-mono text-fg">{v}</span>
    </div>
  );
}
