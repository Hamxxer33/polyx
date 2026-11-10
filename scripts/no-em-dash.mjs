// Fails if any user-facing source contains an em dash (U+2014) or en dash (U+2013).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
const bad = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css|svg|html|md|json)$/.test(f)) {
      readFileSync(p, "utf8").split("\n").forEach((l, i) => { if (/[\u2013\u2014]/.test(l)) bad.push(`${p}:${i + 1}`); });
    }
  }
};
["src", "public", "README.md"].forEach((d) => { try { statSync(d).isDirectory() ? walk(d) : readFileSync(d, "utf8").split("\n").forEach((l, i) => { if (/[\u2013\u2014]/.test(l)) bad.push(`${d}:${i + 1}`); }); } catch {} });
if (bad.length) { console.error("Dashes found:\n" + bad.join("\n")); process.exit(1); }
console.log("No em or en dashes in src/, public/ or README.md.");
