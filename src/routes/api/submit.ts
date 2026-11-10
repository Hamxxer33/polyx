import { createFileRoute } from "@tanstack/react-router";
import { SCHEDULE, WALLET_RE } from "@/config/polyx";
import { submitWallet } from "@/lib/form.server";

const seen = new Map<string, number>();

export const Route = createFileRoute("/api/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown> = {};
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
        }
        const wallet = String(body.wallet ?? "").trim();
        const allocation = String(body.allocation ?? "").slice(0, 64);
        if (!WALLET_RE.test(wallet)) {
          return Response.json({ ok: false, error: "Enter a valid wallet address." }, { status: 400 });
        }
        if (body.demo === true) {
          await new Promise((r) => setTimeout(r, 700));
          if (wallet.toLowerCase().startsWith("0xbad0")) {
            return Response.json({ ok: false, error: "We could not save your wallet. Try again." }, { status: 502 });
          }
          return Response.json({ ok: true, via: "demo" });
        }
        if (SCHEDULE.submissionsCloseAt && Date.now() > new Date(SCHEDULE.submissionsCloseAt).getTime()) {
          return Response.json({ ok: false, error: "Submissions are closed." }, { status: 410 });
        }
        // Light per-instance throttle: one submit per wallet every 30s.
        const key = wallet.toLowerCase();
        const last = seen.get(key) ?? 0;
        if (Date.now() - last < 30_000) return Response.json({ ok: true, via: "dedupe" });
        seen.set(key, Date.now());

        const out = await submitWallet(wallet, allocation);
        if (out.ok) return Response.json(out);
        seen.delete(key);
        return Response.json(out, { status: out.status });
      },
    },
  },
});
