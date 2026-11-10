import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Prism } from "@/components/prism";
import { Faq } from "@/components/faq";
import { Arrow, Shield } from "@/components/icons";
import { CHAIN, NFT, NFT_LIVE, PROJECT, RATES, SCHEDULE, TBA, TOKEN } from "@/config/polyx";
import { compact } from "@/lib/format";
import { fmt, fmtDate } from "@/lib/format";

export const Route = createFileRoute("/")({ component: Landing });

const perTx = RATES.perTx != null ? fmt(RATES.perTx) : TBA;
const perNft = !NFT_LIVE ? "soon" : RATES.perNft != null ? fmt(RATES.perNft) : TBA;

function Landing() {
  return (
    <div className="relative overflow-x-clip">
      <SiteHeader />
      <Hero />
      <SpecStrip />
      <How />
      <Formula />
      <Timeline />
      <Safety />
      <section id="faq" className="wrap mt-28 grid grid-cols-1 gap-10 md:mt-36 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="h-display mt-4 text-3xl leading-[1.05] sm:text-[40px]">Straight answers.</h2>
          <p className="mt-4 max-w-xs text-muted">Anything else, ask in our channels. The team never DMs first.</p>
        </div>
        <Faq />
      </section>
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 -top-20" />
      <div className="pointer-events-none absolute top-[-200px] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-iris/10 blur-[120px]" />
      <div className="wrap relative grid grid-cols-1 items-center gap-6 pt-10 pb-12 md:grid-cols-[1.1fr_0.9fr] md:gap-4 md:pt-20 md:pb-24">
        <div>
          <div className="rise chip border-volt/25 bg-volt/[0.06] text-volt">
            <span className="live-dot size-1.5 rounded-full bg-volt" />
            Allocation checker is live
          </div>
          <h1 className="rise d1 h-display mt-6 text-[44px] leading-[0.98] sm:text-[64px] lg:text-[80px]">
            Your history,
            <br />
            <span className="text-muted">cut into </span>
            <span className="relative whitespace-nowrap text-volt">rewards.</span>
          </h1>
          <p className="rise d2 mt-6 max-w-[520px] text-[17px] leading-relaxed text-muted sm:text-[18px]">
            {PROJECT.name} rewards wallets for what they have already done. Every transaction on {CHAIN.longName} adds to your share, read live from the chain.{NFT_LIVE ? ` Every ${NFT.name} NFT adds a bonus on top.` : ` A ${NFT.name} NFT bonus is coming at launch.`}
          </p>
          <div className="rise d3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/check" className="btn-volt h-14 px-7 text-[16px]">
              Check my allocation
              <Arrow className="size-[18px]" />
            </Link>
            <a href="#how" className="btn-ghost h-14 px-7 text-[16px]">How it works</a>
          </div>
          <ul className="rise d4 mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-faint">
            <li className="flex items-center gap-2"><Dot />Free to check</li>
            <li className="flex items-center gap-2"><Dot />No signature needed</li>
            <li className="flex items-center gap-2"><Dot />No presale</li>
          </ul>
        </div>
        <div className="rise d2 relative mx-auto w-full max-w-[460px] md:max-w-none">
          <Prism className="w-full" />
          <PreviewCard />
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="size-1 rounded-full bg-volt/80" />;
}

function PreviewCard() {
  return (
    <div className="float absolute right-0 bottom-2 w-[210px] rounded-2xl border border-line-strong bg-surface/85 p-4 backdrop-blur-xl sm:right-2 sm:bottom-8 sm:w-[240px]" style={{ animationDelay: "-3s" }}>
      <p className="eyebrow text-[10px]">Allocation formula</p>
      <div className="mt-3 space-y-2 font-mono text-[12px]">
        <div className="flex justify-between text-muted"><span>Tx x {perTx}</span><span className="text-fg">tx share</span></div>
        <div className="flex justify-between text-muted"><span>NFT x {perNft}</span><span className="text-fg">nft share</span></div>
        <div className="h-px bg-line" />
        <div className="flex justify-between"><span className="text-muted">Total</span><span className="text-volt">${TOKEN.symbol}</span></div>
      </div>
    </div>
  );
}

function SpecStrip() {
  const cells = [
    { k: "Network", v: CHAIN.longName },
    { k: "Total supply", v: TOKEN.totalSupply != null ? `${compact(TOKEN.totalSupply)} ${TOKEN.symbol}` : TBA },
    { k: "Per transaction", v: RATES.perTx != null ? `${perTx} ${TOKEN.symbol}` : TBA },
    { k: "Snapshot", v: fmtDate(SCHEDULE.snapshotAt) ?? TBA },
  ];
  return (
    <section className="wrap">
      <div className="grid grid-cols-2 overflow-hidden rounded-[20px] border border-line md:grid-cols-4">
        {cells.map((c, i) => (
          <div key={c.k} className={"bg-surface/60 p-5 sm:p-6 " + (i % 2 ? "border-l border-line " : "") + (i > 1 ? "border-t border-line md:border-t-0 " : "") + (i === 2 ? "md:border-l " : "")}>
            <p className="eyebrow text-[10px]">{c.k}</p>
            <p className="mt-2 font-display text-[17px] font-medium tracking-tight sm:text-[20px]">{c.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function How() {
  const steps = [
    { n: "01", t: "Check", b: `Paste any ${CHAIN.name} address or connect a wallet. We read its transactions and NFTs straight from the chain.` },
    { n: "02", t: "Complete", b: "Follow the official channels so you catch the snapshot and the claim. Each step takes seconds." },
    { n: "03", t: "Lock in", b: "Submit your wallet. It is recorded for the final list. No signature, no fee, nothing to approve." },
  ];
  return (
    <section id="how" className="wrap mt-28 md:mt-36">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 className="h-display mt-4 max-w-xl text-3xl leading-[1.05] sm:text-[48px]">Three steps. Under a minute.</h2>
        </div>
        <p className="max-w-sm text-muted">Claiming opens later on this site. Until then, the only thing to do is make sure your wallet is on the list.</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="panel group relative overflow-hidden p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] text-faint">{s.n}</span>
              <span className="h-px w-12 bg-line transition-all duration-500 group-hover:w-20 group-hover:bg-volt/60" />
            </div>
            <h3 className="h-display mt-14 text-[28px]">{s.t}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Formula() {
  return (
    <section id="formula" className="wrap mt-28 md:mt-36">
      <div className="panel noise relative overflow-hidden p-6 sm:p-10 md:p-14">
        <div className="pointer-events-none absolute -top-40 -right-40 size-[420px] rounded-full bg-volt/10 blur-[100px]" />
        <p className="eyebrow relative">Allocation</p>
        <h2 className="h-display relative mt-4 max-w-2xl text-3xl leading-[1.05] sm:text-[48px]">Two inputs. Nothing self reported.</h2>
        <div className="relative mt-12 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <Term label="Transactions" sub={`Sent from your wallet on ${CHAIN.longName}`} rate={RATES.perTx != null ? `x ${perTx}` : "x rate TBA"} />
          <Op>+</Op>
          <Term label={`${NFT.name} NFTs`} sub={NFT_LIVE ? "Held by your wallet at the snapshot" : "Bonus switches on when the collection launches"} rate={!NFT_LIVE ? "Soon" : RATES.perNft != null ? `x ${perNft}` : "x rate TBA"} accent="iris" />
          <Op>=</Op>
          <div className="flex flex-col justify-between rounded-2xl bg-volt p-6 text-ink">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-70">Your share</p>
            <p className="mt-8 font-display text-[34px] leading-none font-semibold tracking-tight">${TOKEN.symbol}</p>
            <p className="mt-3 text-[13px] opacity-75">Estimated live, fixed at the snapshot</p>
          </div>
        </div>
        <div className="relative mt-8 grid gap-x-10 gap-y-3 text-[14px] text-muted sm:grid-cols-3">
          <p><span className="text-fg">Minimum.</span> {RATES.minTx} transaction{RATES.minTx === 1 ? "" : "s"} or one NFT qualifies a wallet.</p>
          <p><span className="text-fg">Cap.</span> {RATES.txCap != null ? `Up to ${fmt(RATES.txCap)} transactions count per wallet.` : "A per-wallet transaction cap may apply to stop farming."}</p>
          <p><span className="text-fg">Fair play.</span> Sybil and bot wallets are filtered before the final list.</p>
        </div>
      </div>
    </section>
  );
}

function Term({ label, sub, rate, accent = "volt" }: { label: string; sub: string; rate: string; accent?: "volt" | "iris" }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface-2 p-6">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">{label}</p>
      <p className={"mt-8 font-display text-[34px] leading-none font-semibold tracking-tight " + (accent === "volt" ? "text-volt" : "text-iris-soft")}>{rate}</p>
      <p className="mt-3 text-[13px] text-faint">{sub}</p>
    </div>
  );
}

function Op({ children }: { children: string }) {
  return <div className="grid place-items-center py-1 font-display text-3xl text-faint md:px-2">{children}</div>;
}

function Timeline() {
  const items = [
    { t: "Checker live", d: fmtDate(SCHEDULE.checkerOpens), b: "Check any wallet and submit it for the list.", live: true },
    { t: "Snapshot", d: fmtDate(SCHEDULE.snapshotAt), b: "Transactions and NFT balances are frozen.", live: false },
    { t: "Claim opens", d: fmtDate(SCHEDULE.claimOpensAt), b: `Claim ${TOKEN.symbol} on ${PROJECT.domain}. Nowhere else.`, live: false },
  ];
  return (
    <section id="timeline" className="wrap mt-28 md:mt-36">
      <p className="eyebrow">Timeline</p>
      <h2 className="h-display mt-4 text-3xl leading-[1.05] sm:text-[48px]">Where we are.</h2>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-3">
        {items.map((it, i) => (
          <li key={it.t} className="relative bg-bg p-7">
            <div className="flex items-center gap-3">
              <span className={"grid size-7 place-items-center rounded-full border font-mono text-[11px] " + (it.live ? "border-volt bg-volt text-ink" : "border-line-strong text-faint")}>{i + 1}</span>
              <span className={"font-mono text-[12px] tracking-wider uppercase " + (it.live ? "text-volt" : "text-faint")}>{it.live ? "Now" : (it.d ?? "To be announced")}</span>
            </div>
            <h3 className="h-display mt-8 text-[24px]">{it.t}</h3>
            <p className="mt-2 text-[15px] text-muted">{it.b}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Safety() {
  const rules = [
    `The only official site is ${PROJECT.domain}.`,
    "We will never DM you first or ask for a seed phrase.",
    "Checking and submitting never need a signature or a payment.",
  ];
  return (
    <section className="wrap mt-28 md:mt-36">
      <div className="flex flex-col gap-6 rounded-[20px] border border-volt/20 bg-volt/[0.04] p-6 sm:p-8 md:flex-row md:items-center md:gap-10">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-volt/15 text-volt"><Shield className="size-6" /></span>
          <p className="h-display text-[22px]">Stay safe</p>
        </div>
        <ul className="grid flex-1 gap-3 text-[14px] text-muted md:grid-cols-3">
          {rules.map((r) => (
            <li key={r} className="flex gap-2.5"><span className="mt-2 size-1 shrink-0 rounded-full bg-volt" />{r}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="wrap mt-28 md:mt-36">
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface px-6 py-16 text-center sm:py-24">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <Prism className="pointer-events-none absolute -bottom-40 left-1/2 w-[560px] -translate-x-1/2 opacity-30" />
        <h2 className="h-display relative mx-auto max-w-2xl text-[34px] leading-[1.02] sm:text-[56px]">See what your wallet is worth.</h2>
        <p className="relative mx-auto mt-5 max-w-md text-muted">One address. Live chain data. Ten seconds.</p>
        <Link to="/check" className="btn-volt relative mt-9 h-14 px-8 text-[16px]">
          Check my allocation
          <Arrow className="size-[18px]" />
        </Link>
      </div>
    </section>
  );
}
