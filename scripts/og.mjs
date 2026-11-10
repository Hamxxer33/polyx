// Renders public/og.png (1200x630) and the PNG icons from the live dev server's own art.
// Usage: dev server on :8080, then `node scripts/og.mjs`.
import { chromium } from "playwright";
const BASE = process.env.BASE_URL ?? "http://localhost:8080";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.evaluate(async () => {
  const prism = document.querySelector("svg[viewBox='0 0 480 480']").outerHTML;
  const mark = document.querySelector("header svg[viewBox='0 0 32 32']").outerHTML;
  document.body.innerHTML = `
  <div style="position:fixed;inset:0;background:#08090B;overflow:hidden;font-family:'Geist Variable',sans-serif">
    <div style="position:absolute;inset:0;background-image:linear-gradient(to right,rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.04) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse 70% 80% at 70% 50%,#000 20%,transparent 75%)"></div>
    <div style="position:absolute;right:-60px;top:-25px;width:680px;height:680px">${prism}</div>
    <div style="position:absolute;left:72px;top:64px;display:flex;align-items:center;gap:14px">
      <div style="width:44px;height:44px">${mark}</div>
      <span style="font-family:'Unbounded Variable';font-weight:600;font-size:28px;letter-spacing:.08em;color:#F3F4F1">POLYX</span>
    </div>
    <div style="position:absolute;left:72px;top:190px;font-family:'Unbounded Variable';font-weight:500;letter-spacing:-.035em;line-height:.98;font-size:76px;color:#F3F4F1">
      Your history,<br><span style="color:#A2A7B0">cut into</span><br><span style="color:#C8FF4D">rewards.</span>
    </div>
    <div style="position:absolute;left:72px;bottom:58px;display:flex;gap:12px;align-items:center">
      <span style="display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:#C8FF4D;color:#07080A;font-size:20px;font-weight:600">Check your allocation</span>
      <span style="font-family:'Geist Mono Variable';font-size:15px;letter-spacing:.16em;color:#6B717C;text-transform:uppercase;margin-left:10px">Read live from Polygon</span>
    </div>
  </div>`;
  document.querySelectorAll("svg").forEach((s) => { s.style.width = "100%"; s.style.height = "100%"; });
  await document.fonts.ready;
});
await p.waitForTimeout(500);
await p.screenshot({ path: "public/og.png" });

// Icons from the favicon SVG
for (const [size, file] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"], [512, "icon-512.png"]]) {
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(`<html><body style="margin:0;background:transparent"><img src="${BASE}/favicon.svg" width="${size}" height="${size}" style="display:block"></body></html>`);
  await p.waitForLoadState("networkidle");
  await p.screenshot({ path: "public/" + file, omitBackground: true });
}
await b.close();
console.log("wrote public/og.png, favicon-32.png, apple-touch-icon.png, icon-512.png");
