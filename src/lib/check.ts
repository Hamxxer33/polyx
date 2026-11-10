import { createServerFn } from "@tanstack/react-start";
import { RATES, WALLET_RE } from "@/config/polyx";
import { DEMO_RATES, DEMO_WALLETS } from "@/config/demo";
import { computeAllocation, type Allocation } from "@/lib/allocation";

export type CheckResult =
  | { ok: true; allocation: Allocation; nftLive: boolean; block: number | null; readAt: number; demo: boolean }
  | { ok: false; error: string };

type Input = { wallet: string; demo?: boolean };

export const checkAllocation = createServerFn({ method: "POST" })
  .validator((d: Input) => {
    const wallet = String(d?.wallet ?? "").trim();
    return { wallet, demo: d?.demo === true };
  })
  .handler(async ({ data }): Promise<CheckResult> => {
    if (!WALLET_RE.test(data.wallet)) {
      return { ok: false, error: "That does not look like a wallet address. It should start with 0x and have 40 characters after it." };
    }
    const wallet = data.wallet;

    if (data.demo) {
      await new Promise((r) => setTimeout(r, 900));
      const hit = DEMO_WALLETS[wallet.toLowerCase()];
      if (hit === "error") return { ok: false, error: "The network did not answer in time. Your wallet is fine, try again in a moment." };
      const { tx, nft } = hit ?? { tx: 37, nft: 0 };
      return { ok: true, allocation: computeAllocation(wallet, tx, nft, DEMO_RATES), nftLive: true, block: 287_416_032, readAt: Date.now(), demo: true };
    }

    try {
      const { readActivity } = await import("@/lib/chain.server");
      const a = await readActivity(wallet as `0x${string}`);
      return { ok: true, allocation: computeAllocation(wallet, a.tx, a.nft, RATES), nftLive: a.nftLive, block: a.block, readAt: Date.now(), demo: false };
    } catch (e) {
      console.error("[check] read failed", String(e).slice(0, 300));
      return { ok: false, error: "The network did not answer in time. Your wallet is fine, try again in a moment." };
    }
  });
