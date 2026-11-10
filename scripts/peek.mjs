// Quick visual check: node scripts/peek.mjs <path> <out.png> [mobile] [full]
import { chromium } from "playwright";
const [path, out, mobile, full] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const p = await b.newPage({ viewport: mobile === "1" ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: mobile === "1" ? 2 : 1 });
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto("http://localhost:8080" + path, { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: out, fullPage: full === "1" });
console.log(errs.slice(0, 8).map((e) => e.slice(0, 300)).join("\n") || "no errors");
await b.close();
