import { appendFile, mkdir } from "node:fs/promises";

export type SubmitOutcome =
  | { ok: true; via: "form" | "local" }
  | { ok: false; error: string; status: number; fallback?: { action: string; fields: Record<string, string> } };

function formConfig() {
  const action = process.env.GOOGLE_FORM_ACTION?.trim() ?? "";
  const walletEntry = process.env.GOOGLE_FORM_WALLET_ENTRY?.trim() ?? "";
  const allocationEntry = process.env.GOOGLE_FORM_ALLOCATION_ENTRY?.trim() ?? "";
  const ok = /^https:\/\/docs\.google\.com\/forms\/.+\/formResponse$/.test(action) && /^entry\.\d+$/.test(walletEntry);
  return ok ? { action, walletEntry, allocationEntry } : null;
}

/**
 * Files a wallet with the project's Google Form (same approach as the Ventran
 * checker). Google sometimes answers serverless IPs with 429 + captcha; the
 * response then carries the public form fields so the browser can file it.
 * Without a configured form, local dev writes to .local/submissions.jsonl.
 */
export async function submitWallet(wallet: string, allocation: string): Promise<SubmitOutcome> {
  const cfg = formConfig();
  if (!cfg) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, status: 503, error: "Submissions are not open yet. Follow our socials for the start date." };
    }
    await mkdir(".local", { recursive: true });
    await appendFile(".local/submissions.jsonl", JSON.stringify({ wallet, allocation, at: new Date().toISOString() }) + "\n");
    return { ok: true, via: "local" };
  }

  const fields: Record<string, string> = { [cfg.walletEntry]: wallet };
  if (cfg.allocationEntry) fields[cfg.allocationEntry] = allocation;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(cfg.action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fields),
      signal: controller.signal,
      redirect: "follow",
    });
    const text = (await res.text().catch(() => "")).toLowerCase();
    if (res.ok || text.includes("your response has been recorded")) return { ok: true, via: "form" };
    return {
      ok: false,
      status: 502,
      error: "We could not save your wallet. Try again.",
      fallback: res.status === 429 ? { action: cfg.action, fields } : undefined,
    };
  } catch {
    return { ok: false, status: 502, error: "We could not reach the form. Try again.", fallback: { action: cfg.action, fields } };
  } finally {
    clearTimeout(timer);
  }
}
