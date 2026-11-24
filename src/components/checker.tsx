import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { CHAIN, NFT, NFT_LIVE, PROJECT, SOCIALS, EXTRA_TASKS, TBA, TOKEN, WALLET_RE } from "@/config/polyx";
import { DEMO_SOCIALS } from "@/config/demo";
import { checkAllocation, type CheckResult } from "@/lib/check";
import { buildTasks, prunedDone, type Task } from "@/lib/tasks";
import { cn, fmt, short } from "@/lib/format";
import { Alert, Arrow, ArrowUpRight, Check, Copy, DiscordLogo, Lock, Search, Spinner, TelegramLogo, XLogo } from "@/components/icons";
import { Mark } from "@/components/logo";

type Ok = Extract<CheckResult, { ok: true }>;
type Phase = { s: "idle" } | { s: "checking"; wallet: string } | { s: "done"; r: Ok } | { s: "error"; msg: string; wallet: string };

const TASKS_KEY = "polyx:tasks";
const submittedKey = (w: string) => `polyx:submitted:${w.toLowerCase()}`;

export function Checker({ demo, initialWallet }: { demo: boolean; initialWallet?: string }) {
  const [input, setInput] = useState(initialWallet ?? "");
  const [invalid, setInvalid] = useState(false);
  const [phase, setPhase] = useState<Phase>({ s: "idle" });
  const req = useRef(0);
  const { address } = useAccount();
  const lastAuto = useRef<string | null>(null);

  async function run(raw: string) {
    const wallet = raw.trim();
    if (!WALLET_RE.test(wallet)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    const id = ++req.current;
    setPhase({ s: "checking", wallet });
    try {
      const res = await checkAllocation({ data: { wallet, demo } });
      if (id !== req.current) return;
      setPhase(res.ok ? { s: "done", r: res } : { s: "error", msg: res.error, wallet });
    } catch {
      if (id !== req.current) return;
      setPhase({ s: "error", msg: "Something went wrong reading the chain. Try again in a moment.", wallet });
    }
  }

  useEffect(() => {
    if (initialWallet && WALLET_RE.test(initialWallet)) void run(initialWallet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (address && address !== lastAuto.current) {
      lastAuto.current = address;
      setInput(address);
      void run(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const result = phase.s === "done" ? phase.r : null;
  const eligible = !!result?.allocation.eligible;

  return (
    <div className="space-y-4">
      <Step n={1} title="Your wallet" state={result ? "done" : "active"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(input);
          }}
        >
          <label htmlFor="wallet" className="sr-only">Wallet address</label>
          <div className="relative">
            <input
              id="wallet"
              className={cn("field pr-28", invalid && "border-danger/70 focus:border-danger/70")}
              placeholder="0x… paste any address"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (invalid) setInvalid(false);
              }}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              aria-invalid={invalid}
              aria-describedby="wallet-help"
            />
            {input ? (
              <button type="button" onClick={() => { setInput(""); setInvalid(false); }} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider text-faint uppercase hover:text-fg">
                Clear
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  try { setInput((await navigator.clipboard.readText()).trim()); } catch { /* clipboard blocked */ }
                }}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] tracking-wider text-muted uppercase hover:text-fg"
              >
                Paste
              </button>
            )}
          </div>
          <p id="wallet-help" className={cn("mt-2.5 text-[13px]", invalid ? "text-danger" : "text-faint")}>
            {invalid ? "That is not a valid address. It starts with 0x followed by 40 letters and numbers." : `Any ${CHAIN.longName} address. Read only, no signature.`}
          </p>
          <div className="mt-5 grid gap-3">
            <button type="submit" className="btn-volt h-[52px] w-full" disabled={phase.s === "checking" || !input.trim()}>
              {phase.s === "checking" ? <><Spinner className="size-[18px]" />Reading {CHAIN.name}…</> : <><Search className="size-[18px]" />Check allocation</>}
            </button>
          </div>
        </form>
      </Step>

      {phase.s === "checking" ? <Scanning wallet={phase.wallet} demo={demo} /> : null}
      {phase.s === "error" ? <ErrorCard msg={phase.msg} onRetry={() => void run(phase.wallet)} /> : null}
      {result ? (
        result.allocation.eligible ? (
          <ResultCard r={result} onReset={() => { setPhase({ s: "idle" }); setInput(""); }} />
        ) : (
          <NotEligible wallet={result.allocation.wallet} onReset={() => { setPhase({ s: "idle" }); setInput(""); }} />
        )
      ) : null}

      <TasksAndSubmit demo={demo} result={eligible ? result : null} />
    </div>
  );
}

function Step({ n, title, state, children, aside }: { n: number; title: string; state: "active" | "done" | "locked"; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className={cn("panel rise p-5 sm:p-7", state === "locked" && "bg-surface/50")}>
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid size-7 place-items-center rounded-full border font-mono text-[12px] transition",
              state === "done" && "border-volt bg-volt text-ink",
              state === "active" && "border-volt/60 text-volt",
              state === "locked" && "border-line-strong text-faint",
            )}
          >
            {state === "done" ? <Check className="size-3.5" /> : n}
          </span>
          <h2 className={cn("text-[16px] font-medium", state === "locked" ? "text-faint" : "text-fg")}>{title}</h2>
        </div>
        {aside ?? (state === "locked" ? <Lock className="size-4 text-faint" /> : null)}
      </header>
      {children}
    </section>
  );
}

function Scanning({ wallet, demo }: { wallet: string; demo: boolean }) {
  return (
    <section className="panel rise overflow-hidden p-5 sm:p-7" aria-live="polite">
      <div className="flex items-center justify-between">
        <span className="chip"><span className="live-dot size-1.5 rounded-full bg-volt" />Reading {CHAIN.longName}</span>
        <span className="font-mono text-[12px] text-faint">{short(wallet)}</span>
      </div>
      <div className="relative mt-7 h-14 w-2/3 overflow-hidden rounded-xl bg-surface-2">
        <div className="scan absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
      <div className="mt-6 grid gap-2">
        {["Counting transactions", NFT_LIVE || demo ? `Reading ${NFT.name} balance` : "Checking NFT bonus status", "Applying rates"].map((t, i) => (
          <div key={t} className="flex items-center gap-3 text-[14px] text-muted" style={{ opacity: 1 - i * 0.25 }}>
            <Spinner className="size-4 text-volt" />
            {t}
          </div>
        ))}
      </div>
    </section>
  );
}

function ErrorCard({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <section className="panel rise border-danger/30 p-5 sm:p-7" role="alert">
      <div className="flex gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-danger/10 text-danger"><Alert className="size-5" /></span>
        <div className="flex-1">
          <p className="font-medium text-fg">Could not read the chain</p>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">{msg}</p>
          <button type="button" onClick={onRetry} className="btn-ghost mt-4 h-10 px-5 text-[14px]">Try again</button>
        </div>
      </div>
    </section>
  );
}

function NotEligible({ wallet, onReset }: { wallet: string; onReset: () => void }) {
  return (
    <section className="panel rise p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="chip border-warn/30 text-warn">Not eligible yet</span>
        <AddressPill wallet={wallet} />
      </div>
      <p className="h-display mt-7 text-[30px] leading-tight sm:text-[36px]">No activity found.</p>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
        This wallet has no transactions on {CHAIN.longName}{NFT_LIVE ? ` and holds no ${NFT.name} NFT` : ""}. Try the wallet you use most, or come back after you have used the chain.
      </p>
      <button type="button" onClick={onReset} className="btn-ghost mt-6 h-11 px-5 text-[14px]">Check another wallet</button>
    </section>
  );
}

function useCountUp(target: number | null, ms = 1100) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (target == null) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setV(target);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - p, 4);
      setV(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function AddressPill({ wallet }: { wallet: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { void navigator.clipboard?.writeText(wallet); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[12px] text-muted hover:text-fg"
      title="Copy address"
    >
      {short(wallet)}
      {copied ? <Check className="size-3.5 text-volt" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function ResultCard({ r, onReset }: { r: Ok; onReset: () => void }) {
  const a = r.allocation;
  const total = useCountUp(a.total);
  const txShare = a.total ? (a.txTokens ?? 0) / a.total : a.nftCount > 0 ? 0.5 : 1;
  const shareText = useMemo(() => {
    const amount = a.total != null ? `${fmt(a.total)} $${TOKEN.symbol}` : `a $${TOKEN.symbol} allocation`;
    const parts = [`${fmt(a.txCount)} transactions`, a.nftCount ? `${a.nftCount} ${NFT.name} NFT${a.nftCount === 1 ? "" : "s"}` : null].filter(Boolean).join(" and ");
    const url = typeof window !== "undefined" ? `${window.location.origin}/check` : `https://${PROJECT.domain}/check`;
    return `My wallet earned ${amount} from ${parts} on ${CHAIN.name}.\n\nCheck yours: ${url}\n\n@polyx_market`;
  }, [a]);

  return (
    <section className="panel rise relative overflow-hidden" aria-live="polite">
      <div className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-volt/15 blur-[90px]" />
      <div className="relative p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="chip border-volt/30 bg-volt/[0.07] text-volt"><Check className="size-3.5" />Eligible</span>
          <div className="flex items-center gap-2">
            {r.demo ? <span className="chip border-iris/40 text-iris-soft">Demo data</span> : null}
            <AddressPill wallet={a.wallet} />
          </div>
        </div>
        <p className="eyebrow mt-8">Estimated allocation</p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display font-semibold tracking-[-0.04em]">
          <span className="tnum text-[40px] leading-none text-fg sm:text-[64px]">{a.total != null ? fmt(total) : TBA}</span>
          <span className="text-[16px] tracking-normal text-volt sm:text-[22px]">${TOKEN.symbol}</span>
        </p>
        {a.total == null ? <p className="mt-3 text-[14px] text-muted">Rates are not announced yet. Your counts below are what will be scored.</p> : null}
        <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-volt transition-[width] duration-1000" style={{ width: `${txShare * 100}%` }} />
          <div className="h-full bg-iris transition-[width] duration-1000" style={{ width: `${(1 - txShare) * 100}%` }} />
        </div>
      </div>
      <dl className="relative divide-y divide-line border-t border-line">
        <Row
          dot="bg-volt"
          label="Transactions"
          detail={a.capped ? `${fmt(a.txCount)} sent, ${fmt(a.countedTx)} counted (cap)` : `${fmt(a.txCount)} sent on ${CHAIN.name}`}
          rate={a.rates.perTx != null ? `x ${fmt(a.rates.perTx)}` : "rate TBA"}
          value={a.txTokens != null ? fmt(a.txTokens) : TBA}
        />
        <Row
          dot="bg-iris"
          label={`${NFT.name} NFTs`}
          detail={r.nftLive ? `${a.nftCount} held` : "Bonus switches on when the collection launches"}
          rate={!r.nftLive ? "" : a.rates.perNft != null ? `x ${fmt(a.rates.perNft)}` : "rate TBA"}
          value={!r.nftLive ? "Soon" : a.nftTokens != null ? fmt(a.nftTokens) : TBA}
          muted={!r.nftLive}
        />
      </dl>
      <div className="relative flex flex-col gap-3 border-t border-line bg-ink/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <p className="max-w-[300px] font-mono text-[11px] leading-relaxed tracking-wide text-faint">
          Read live from {CHAIN.longName}{r.block ? ` at block ${fmt(r.block)}` : ""}. Final amount fixed at the snapshot.
        </p>
        <div className="flex shrink-0 gap-2">
          <a href={`https://x.com/intent/post?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="btn-ghost h-10 flex-1 px-4 text-[14px] whitespace-nowrap">
            <XLogo className="size-3.5" />Share
          </a>
          <button type="button" onClick={onReset} className="btn-ghost h-10 flex-1 px-4 text-[14px] whitespace-nowrap">Check another</button>
        </div>
      </div>
    </section>
  );
}

function Row({ dot, label, detail, rate, value, muted = false }: { dot: string; label: string; detail: string; rate: string; value: string; muted?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:px-7">
      <dt className="flex items-center gap-3">
        <span className={cn("size-2 rounded-full", dot)} />
        <span>
          <span className="block text-[15px] text-fg">{label}</span>
          <span className="block text-[13px] text-faint">{detail}</span>
        </span>
      </dt>
      <span className="hidden font-mono text-[13px] text-muted sm:block">{rate}</span>
      <dd className={cn("tnum text-right font-display font-medium", muted ? "text-[14px] text-faint" : "text-[18px]")}>{value}</dd>
    </div>
  );
}

const TASK_ICON: Record<Task["kind"], typeof XLogo> = { x: XLogo, telegram: TelegramLogo, discord: DiscordLogo, link: ArrowUpRight };

function TasksAndSubmit({ demo, result }: { demo: boolean; result: Ok | null }) {
  const tasks = useMemo(() => buildTasks({ ...(demo ? DEMO_SOCIALS : SOCIALS), extra: EXTRA_TASKS }), [demo]);
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    try { setDone(prunedDone(JSON.parse(localStorage.getItem(TASKS_KEY) ?? "[]"), tasks)); } catch { /* ignore */ }
  }, [tasks]);
  const mark = (id: string) => {
    setDone((d) => {
      const next = d.includes(id) ? d : [...d, id];
      try { localStorage.setItem(TASKS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };
  const allDone = tasks.every((t) => done.includes(t.id));
  const locked = !result;

  return (
    <>
      <Step
        n={2}
        title="Join the community"
        state={tasks.length === 0 ? locked ? "locked" : "done" : allDone ? "done" : "active"}
        aside={tasks.length ? <span className="font-mono text-[12px] text-muted">{done.length}/{tasks.length}</span> : undefined}
      >
        {tasks.length === 0 ? (
          <p className="text-[14px] text-muted">Official channels open soon. Nothing to do here yet, go straight to step 3.</p>
        ) : (
          <>
            <p className="mb-4 text-[14px] text-muted">Complete all requirements below before locking in your wallet.</p>
            <div className="mb-4 h-1 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-volt transition-[width] duration-700" style={{ width: `${(done.length / tasks.length) * 100}%` }} />
            </div>
            <ul className="space-y-2">
              {tasks.map((t) => {
                const Icon = TASK_ICON[t.kind];
                const ok = done.includes(t.id);
                return (
                  <li key={t.id}>
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => mark(t.id)}
                      className={cn(
                        "group flex items-center gap-4 rounded-2xl border p-3.5 transition duration-300 sm:p-4",
                        ok ? "border-volt/25 bg-volt/[0.04]" : "border-line bg-surface-2/60 hover:border-white/20",
                      )}
                    >
                      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", ok ? "bg-volt text-ink" : "bg-raise text-fg")}>
                        {ok ? <Check className="size-4" /> : <Icon className="size-4" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block text-[15px]", ok ? "text-muted" : "text-fg")}>{t.label}</span>
                        <span className="block truncate text-[13px] text-faint">{t.detail}</span>
                      </span>
                      <span className={cn("font-mono text-[11px] tracking-wider uppercase", ok ? "text-volt" : "text-muted group-hover:text-fg")}>
                        {ok ? "Done" : "Open"}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Step>
      <SubmitStep demo={demo} result={result} ready={allDone} />
    </>
  );
}

function SubmitStep({ demo, result, ready }: { demo: boolean; result: Ok | null; ready: boolean }) {
  const wallet = result?.allocation.wallet ?? "";
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<{ s: "idle" } | { s: "sending" } | { s: "done" } | { s: "error"; msg: string }>({ s: "idle" });

  useEffect(() => {
    if (!wallet) return setState({ s: "idle" });
    try { setState(localStorage.getItem(submittedKey(wallet)) ? { s: "done" } : { s: "idle" }); } catch { setState({ s: "idle" }); }
  }, [wallet]);

  async function submit() {
    if (!result) return;
    setState({ s: "sending" });
    const allocation = result.allocation.total != null ? String(result.allocation.total) : `tx:${result.allocation.txCount};nft:${result.allocation.nftCount}`;
    try {
      const res = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ wallet, allocation, demo }) });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fallback?: { action: string; fields: Record<string, string> } };
      if (!j.ok && j.fallback) {
        // Google blocked the server. File it from the browser instead (opaque, fire and forget).
        await fetch(j.fallback.action, { method: "POST", mode: "no-cors", body: new URLSearchParams(j.fallback.fields) });
        j.ok = true;
      }
      if (!j.ok) return setState({ s: "error", msg: j.error ?? "We could not save your wallet. Try again." });
      try { localStorage.setItem(submittedKey(wallet), String(Date.now())); } catch { /* ignore */ }
      setState({ s: "done" });
    } catch {
      setState({ s: "error", msg: "Network error. Check your connection and try again." });
    }
  }

  const locked = !result;
  if (state.s === "done" && result) {
    return (
      <section className="panel rise relative overflow-hidden p-6 text-center sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto size-72 rounded-full bg-volt/15 blur-[80px]" />
        <Mark className="relative mx-auto size-14" />
        <p className="eyebrow relative mt-6 text-volt">Step 3 complete</p>
        <h2 className="h-display relative mt-3 text-[32px] leading-tight sm:text-[40px]">You are locked in.</h2>
        <p className="relative mx-auto mt-3 max-w-sm text-[15px] text-muted">
          {short(wallet)} is on the list. Keep using {CHAIN.name} until the snapshot and watch our channels for the claim date.
        </p>
        <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" hash="timeline" className="btn-ghost h-11 px-5 text-[14px]">See the timeline</Link>
          <a href="/check" className="btn-ghost h-11 px-5 text-[14px]">Check another wallet</a>
        </div>
      </section>
    );
  }

  const blocker = locked ? "Check an eligible wallet first." : !ready ? "Complete step 2 to continue." : !agree ? "Accept the terms to continue." : null;

  return (
    <Step n={3} title="Lock in your wallet" state={locked || !ready ? "locked" : "active"}>
      {locked ? (
        <p className="text-[14px] text-faint">Your wallet is submitted here once the first two steps are done.</p>
      ) : (
        <>
          <div className="rounded-2xl border border-line bg-ink/50 p-4">
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-muted">Wallet</span>
              <span className="font-mono text-fg">{short(wallet)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[14px]">
              <span className="text-muted">Estimated</span>
              <span className="font-mono text-fg">{result.allocation.total != null ? `${fmt(result.allocation.total)} ${TOKEN.symbol}` : TBA}</span>
            </div>
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14px] text-muted">
            <input type="checkbox" className="peer sr-only" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-line-strong transition peer-checked:border-volt peer-checked:bg-volt peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-volt">
              {agree ? <Check className="size-3.5" /> : null}
            </span>
            <span>
              I agree to the <Link to="/terms" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-volt">Terms</Link> and understand the estimate is not final.
            </span>
          </label>
          <button type="button" className="btn-volt mt-5 h-[52px] w-full" disabled={!!blocker || state.s === "sending"} onClick={() => void submit()}>
            {state.s === "sending" ? <><Spinner className="size-[18px]" />Saving…</> : <>Lock in wallet<Arrow className="size-[18px]" /></>}
          </button>
          {state.s === "error" ? (
            <p role="alert" className="mt-3 flex items-center gap-2 text-[13px] text-danger"><Alert className="size-4" />{state.msg}</p>
          ) : blocker ? (
            <p className="mt-3 text-center text-[13px] text-faint">{blocker}</p>
          ) : (
            <p className="mt-3 text-center text-[13px] text-faint">Free. No signature. Only your public address is stored.</p>
          )}
        </>
      )}
    </Step>
  );
}
