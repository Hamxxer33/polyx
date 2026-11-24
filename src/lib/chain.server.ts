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

/** Etherscan V2 is a last-resort Polygon data source; keep its key server-side. */
async function etherscanProxy(action: string, params: Record<string, string> = {}): Promise<`0x${string}`> {
  const apikey = process.env.POLYX_ETHERSCAN_API_KEY?.trim();
  if (!apikey) throw new Error("POLYX_ETHERSCAN_API_KEY is not configured");

  const query = new URLSearchParams({
    chainid: String(CHAIN.id),
    module: "proxy",
    action,
    ...params,
    apikey,
  });
  const response = await fetch(`https://api.etherscan.io/v2/api?${query.toString()}`, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`Etherscan API returned HTTP ${response.status}`);
  const body = (await response.json()) as { result?: unknown; error?: { message?: string } };
  if (body.error) throw new Error(body.error.message || "Etherscan JSON-RPC request failed");
  if (typeof body.result !== "string" || !/^0x[0-9a-fA-F]+$/.test(body.result)) {
    throw new Error("Etherscan returned an invalid result");
  }
  return body.result as `0x${string}`;
}

async function transactionCount(wallet: `0x${string}`): Promise<bigint> {
  try {
    return BigInt(await client().getTransactionCount({ address: wallet }));
  } catch (rpcError) {
    try {
      return BigInt(await etherscanProxy("eth_getTransactionCount", { address: wallet, tag: "latest" }));
    } catch {
      throw rpcError;
    }
  }
}

async function blockNumber(): Promise<bigint | null> {
  try {
    return await client().getBlockNumber();
  } catch {
    try {
      return BigInt(await etherscanProxy("eth_blockNumber"));
    } catch {
      return null;
    }
  }
}

async function nftBalance(wallet: `0x${string}`, collection: `0x${string}`): Promise<bigint> {
  try {
    return await client().readContract({ address: collection, abi: balanceOfAbi, functionName: "balanceOf", args: [wallet] });
  } catch (rpcError) {
    try {
      const data = `0x70a08231${wallet.slice(2).toLowerCase().padStart(64, "0")}`;
      return BigInt(await etherscanProxy("eth_call", { to: collection, data, tag: "latest" }));
    } catch {
      throw rpcError;
    }
  }
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
  const [tx, block] = await Promise.all([
    transactionCount(wallet),
    blockNumber(),
  ]);
  let nft = 0;
  let nftLive = false;
  const collection = nftAddress();
  if (collection) {
    try {
      nft = Number(await nftBalance(wallet, collection));
      nftLive = true;
    } catch {
      nft = 0;
    }
  }
  return { tx: Number(tx), nft, nftLive, block: block == null ? null : Number(block) };
}
