// Walks every screen and state in a headless browser and saves screenshots to shots/.
// Usage: dev server on :8080, then `node scripts/shots.mjs` (CHROME=/path overrides the browser).
import { chromium } from "playwright";
import { mkdirSync, rmSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";
const OUT = "shots";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const W = {
  ok: "0x7A3f9C2b0E61d4A85B19c0e3F2D6a7b84c51E9d2",
  txOnly: "0x5b2e81c4f09a7d3e6b1c8a24f5d90e3c7a6b4f10",
  capped: "0x9c4d2a71e8b05f3c6d9e1a2b7f48c0d35e6a1b72",
  empty: "0x0f1e2d3c4b5a69788796a5b4c3d2e1f00f1e2d3c",
  rpcErr: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  submitErr: "0xbad0000000000000000000000000000000000001",
  live: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
};

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const problems = [];
const saved = [];

async function session(kind) {
  const mobile = kind === "mobile";
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: "reduce",
  });
  // Keep the run local: social links and fonts from elsewhere are not needed.
  await ctx.route(/^https?:\/\/(?!localhost)/, (r) => (r.request().resourceType() === "document" ? r.abort() : r.continue()));
  let page = null;
  ctx.on("page", (p) => page && p !== page && p.close().catch(() => {}));
  page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push(`${kind}: pageerror ${e.message.slice(0, 200)}`));
  page.on("console", (m) => m.type() === "error" && !/net::ERR_FAILED|Failed to load resource/.test(m.text()) && problems.push(`${kind}: console ${m.text().slice(0, 200)}`));
  return { ctx, page, kind };
}

async function shot(s, name, { full = false, focus, keepScroll = false } = {}) {
  if (focus) {
    await s.page.locator(focus).first().evaluate((el) => {
      const y = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo(0, Math.max(0, y));
    });
    await s.page.waitForTimeout(250);
  } else if (!keepScroll) {
    await s.page.evaluate(() => window.scrollTo(0, 0));
    await s.page.waitForTimeout(250);
  }
  const ov = await s.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (ov > 0) problems.push(`${s.kind} ${name}: horizontal overflow ${ov}px`);
  const file = `${OUT}/${s.kind}-${name}.png`;
  await s.page.screenshot({ path: file, fullPage: full });
  saved.push(file);
}

async function go(s, path) {
  await s.page.goto(BASE + path, { waitUntil: "networkidle" });
  await s.page.waitForTimeout(400);
}

async function check(s, wallet) {
  await s.page.fill("#wallet", wallet);
  await s.page.getByRole("button", { name: /Check allocation/ }).click();
}

for (const kind of ["mobile", "desktop"]) {
  const s = await session(kind);
  const { page } = s;

  // Landing
  await go(s, "/");
  await shot(s, "01-landing-hero");
  await shot(s, "02-landing-full", { full: true });
  await shot(s, "03-landing-allocation", { focus: "#formula" });
  await shot(s, "04-landing-timeline", { focus: "#timeline" });
  await page.locator("#faq summary").nth(1).click();
  await shot(s, "05-landing-faq", { focus: "#faq" });

  // Checker, demo data
  await go(s, "/check?demo=1");
  await shot(s, "10-check-idle", { full: kind === "desktop" });
  await page.fill("#wallet", "0x12345");
  await page.getByRole("button", { name: /Check allocation/ }).click();
  await shot(s, "11-check-invalid-address", { focus: "#wallet" });

  await check(s, W.ok);
  await page.getByText(/Counting transactions/).waitFor();
  await shot(s, "12-check-loading", { focus: "#wallet" });
  await page.getByText("Estimated allocation").waitFor();
  await page.waitForTimeout(300);
  await shot(s, "13-check-eligible-tx-and-nft", { focus: "text=Estimated allocation" });
  await shot(s, "14-check-eligible-full", { full: true });

  await check(s, W.txOnly);
  await page.getByText("214 sent on Arbitrum").waitFor();
  await shot(s, "15-check-eligible-tx-only", { focus: "text=Estimated allocation" });

  await check(s, W.capped);
  await page.getByText(/counted \(cap\)/).waitFor();
  await shot(s, "16-check-eligible-capped", { focus: "text=Estimated allocation" });

  await check(s, W.empty);
  await page.getByText("No activity found.").waitFor();
  await shot(s, "17-check-not-eligible", { focus: "text=No activity found." });

  await check(s, W.rpcErr);
  await page.getByText("Could not read the chain").waitFor();
  await shot(s, "18-check-network-error", { focus: "text=Could not read the chain" });

  // Connect wallet (demo mock connector) auto-fills and checks
  await go(s, "/check?demo=1");
  await page.getByRole("button", { name: /Connect wallet/ }).click();
  await page.getByText("Estimated allocation").waitFor();
  await page.waitForTimeout(300);
  await shot(s, "19-check-wallet-connected", { focus: "#wallet" });

  // Tasks
  const tasks = page.locator("section", { hasText: "Join the community" }).locator("a");
  await tasks.nth(0).click();
  await tasks.nth(1).click();
  await shot(s, "20-tasks-in-progress", { focus: "text=Join the community" });
  const n = await tasks.count();
  for (let i = 2; i < n; i++) await tasks.nth(i).click();
  await page.locator("label", { hasText: "I agree to the" }).click();
  await shot(s, "21-submit-ready", { focus: "text=Lock in your wallet" });
  await page.getByRole("button", { name: /Lock in wallet/ }).click();
  await page.getByText("You are locked in.").waitFor();
  await shot(s, "22-submit-success", { focus: "text=You are locked in." });

  // Returning visitor: already submitted
  await go(s, `/check?demo=1&wallet=${W.ok}`);
  await page.getByText("You are locked in.").waitFor();
  await shot(s, "23-returning-already-submitted", { full: kind === "desktop" });

  // Submit error
  await go(s, `/check?demo=1&wallet=${W.submitErr}`);
  await page.getByText("Estimated allocation").waitFor();
  await page.locator("label", { hasText: "I agree to the" }).click();
  await page.getByRole("button", { name: /Lock in wallet/ }).click();
  await page.getByText("We could not save your wallet").waitFor();
  await shot(s, "24-submit-error", { focus: "text=Lock in your wallet" });

  // Live mode: real chain read, rates not announced yet (TBA)
  await page.evaluate(() => localStorage.clear());
  await go(s, `/check?wallet=${W.live}`);
  await page.waitForSelector("text=/Estimated allocation|Could not read the chain/", { timeout: 30_000 });
  await page.waitForTimeout(300);
  await shot(s, "25-live-chain-read-rates-tba", { focus: "#wallet" });

  // Reown AppKit wallet picker (needs a second dev server started with VITE_WALLETCONNECT_PROJECT_ID)
  if (process.env.APPKIT_BASE) {
    await page.goto(process.env.APPKIT_BASE + "/check", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.getByRole("button", { name: /Connect wallet/ }).click();
    await page.waitForTimeout(3000);
    await shot(s, "26-connect-wallet-modal", { full: false, keepScroll: true });
  }

  // Legal + 404
  await go(s, "/terms");
  await shot(s, "30-terms");
  await shot(s, "31-terms-full", { full: true });
  await go(s, "/privacy");
  await shot(s, "32-privacy");
  await go(s, "/does-not-exist");
  await shot(s, "33-not-found");

  await s.ctx.close();
}

await browser.close();
console.log(saved.length + " screenshots in " + OUT + "/");
console.log(problems.length ? "PROBLEMS:\n" + [...new Set(problems)].join("\n") : "No page or console errors.");
