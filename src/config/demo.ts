/**
 * Demo data for previews and screenshots. Only used with `?demo=1` in the URL.
 * Never consulted for real wallets.
 */
export const DEMO_RATES = { perTx: 250, perNft: 50_000, txCap: 2_000, minTx: 1 } as const;

export const DEMO_CONNECTED = "0x7A3f9C2b0E61d4A85B19c0e3F2D6a7b84c51E9d2" as const;

export const DEMO_WALLETS: Record<string, { tx: number; nft: number } | "error"> = {
  // Power user: transactions + NFTs
  "0x7a3f9c2b0e61d4a85b19c0e3f2d6a7b84c51e9d2": { tx: 1284, nft: 3 },
  // Transactions only
  "0x5b2e81c4f09a7d3e6b1c8a24f5d90e3c7a6b4f10": { tx: 214, nft: 0 },
  // Above the transaction cap
  "0x9c4d2a71e8b05f3c6d9e1a2b7f48c0d35e6a1b72": { tx: 5120, nft: 1 },
  // Fresh wallet, nothing on chain
  "0x0f1e2d3c4b5a69788796a5b4c3d2e1f00f1e2d3c": { tx: 0, nft: 0 },
  // Eligible, but the submit fails (to preview the error state)
  "0xbad0000000000000000000000000000000000001": { tx: 52, nft: 0 },
  // Simulated RPC failure
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "error",
};

/** Demo-only socials so the task list can be previewed before real handles exist. */
export const DEMO_SOCIALS = {
  x: "polyx",
  telegram: "polyx",
  discord: "https://discord.gg/polyx",
  posts: ["https://x.com/polyx/status/1"],
} as const;
