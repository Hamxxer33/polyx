import { createPublicClient, defineChain, fallback, http } from "viem";
import { CHAIN, NFT } from "@/config/polyx";

const balanceOfAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

const chain = defineChain({
  id: CHAIN.id,
  name: CHAIN.longName,
  nativeCurrency: { name: CHAIN.nativeSymbol, symbol: CHAIN.nativeSymbol, decimals: 18 },
  rpcUrls: { default: { http: [CHAIN.rpcUrl] } },
});

function client() {
  const urls = [process.env.POLYX_RPC_URL?.trim(), CHAIN.rpcUrl, "rpcBackup" in CHAIN ? CHAIN.rpcBackup : ""].filter(Boolean) as string[];
  return createPublicClient({ chain, transport: fallback(urls.map((u) => http(u, { timeout: 10_000, retryCount: 1 }))) });
}

export function nftAddress(): `0x${string}` | null {
  const raw = (process.env.POLYX_NFT_ADDRESS?.trim() || NFT.address).toLowerCase();
  return /^0x[a-f0-9]{40}$/.test(raw) ? (raw as `0x${string}`) : null;
}

/**
 * Outbound transaction count (nonce) plus NFT balance. The NFT read fails soft:
 * a missing or not-yet-deployed collection must never sink the tx count.
 */
export async function readActivity(wallet: `0x${string}`) {
  const c = client();
  const [tx, block] = await Promise.all([
    c.getTransactionCount({ address: wallet }),
    c.getBlockNumber().catch(() => null),
  ]);
  let nft = 0;
  let nftLive = false;
  const collection = nftAddress();
  if (collection) {
    try {
      nft = Number(await c.readContract({ address: collection, abi: balanceOfAbi, functionName: "balanceOf", args: [wallet] }));
      nftLive = true;
    } catch {
      nft = 0;
    }
  }
  return { tx: Number(tx), nft, nftLive, block: block == null ? null : Number(block) };
}
