/**
 * ============================================================================
 *  POLYX: the ONE file to edit.
 * ============================================================================
 *
 *  Every name, address, rate, link and date the site shows comes from here.
 *  Anything marked  PLACEHOLDER  is waiting on real details from the team.
 *  Leaving a value as `null` or "" is always safe: the site hides that link or
 *  prints "To be announced" instead of inventing a number.
 *
 *  Server-side overrides (set in Vercel, no rebuild of this file needed):
 *    POLYX_RPC_URL              RPC for the chain below (defaults to the public RPC)
 *    POLYX_NFT_ADDRESS          NFT collection address (overrides nft.address)
 *    GOOGLE_FORM_ACTION         https://docs.google.com/forms/d/e/<id>/formResponse
 *    GOOGLE_FORM_WALLET_ENTRY   entry.<number> for the wallet question
 *    GOOGLE_FORM_ALLOCATION_ENTRY  optional entry.<number> for the computed allocation
 *  Client-side (VITE_ prefix, read at build time):
 *    VITE_WALLETCONNECT_PROJECT_ID  Reown / WalletConnect project id
 *    VITE_SITE_URL                  public origin, e.g. https://polyx.xyz (OG tags)
 * ============================================================================
 */

export type ChainKey = "arbitrum" | "base" | "ethereum" | "optimism" | "polygon";

/** Chain presets. Pick one with PROJECT.chain below; nothing else hardcodes a network. */
export const CHAINS = {
  arbitrum: {
    id: 42161,
    name: "Arbitrum",
    longName: "Arbitrum One",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorer: "Arbiscan",
    explorerUrl: "https://arbiscan.io",
    nativeSymbol: "ETH",
  },
  base: {
    id: 8453,
    name: "Base",
    longName: "Base",
    rpcUrl: "https://mainnet.base.org",
    explorer: "BaseScan",
    explorerUrl: "https://basescan.org",
    nativeSymbol: "ETH",
  },
  ethereum: {
    id: 1,
    name: "Ethereum",
    longName: "Ethereum Mainnet",
    rpcUrl: "https://ethereum-rpc.publicnode.com",
    explorer: "Etherscan",
    explorerUrl: "https://etherscan.io",
    nativeSymbol: "ETH",
  },
  optimism: {
    id: 10,
    name: "Optimism",
    longName: "OP Mainnet",
    rpcUrl: "https://mainnet.optimism.io",
    explorer: "Optimistic Etherscan",
    explorerUrl: "https://optimistic.etherscan.io",
    nativeSymbol: "ETH",
  },
  polygon: {
    id: 137,
    name: "Polygon",
    longName: "Polygon PoS",
    rpcUrl: "https://polygon-bor-rpc.publicnode.com",
    rpcBackup: "https://polygon.drpc.org",
    explorer: "PolygonScan",
    explorerUrl: "https://polygonscan.com",
    nativeSymbol: "POL",
  },
} as const;

export const PROJECT = {
  name: "POLYX",
  /** Operator wording used in Terms and Privacy, mid-sentence (lowercase "the"). */
  operator: "the POLYX team",
  /** PLACEHOLDER: official domain, shown in the safety notice. */
  domain: "polyx.xyz",
  /** PLACEHOLDER: public contact address. Empty hides it. */
  contactEmail: "" as string,
  /** Network the checker reads (Polygon PoS mainnet). */
  chain: "polygon" as ChainKey,
  /** Date the Terms and Privacy pages were last updated (display only). */
  legalUpdated: "9 November 2026",
} as const;

export const CHAIN = CHAINS[PROJECT.chain];

export const TOKEN = {
  name: "POLYX",
  /** Ticker without the $ */
  symbol: "POLYX",
  /** PLACEHOLDER: token not live yet. ERC-20 address once deployed. Empty = "Not deployed yet". */
  address: "" as string,
  decimals: 18,
  /** Whole tokens. 1 billion, confirmed. */
  totalSupply: 1_000_000_000 as number | null,
  /** PLACEHOLDER: share of supply for this airdrop, in percent. null = TBA. */
  airdropPercent: null as number | null,
} as const;

export const NFT = {
  /** PLACEHOLDER */
  name: "POLYX Genesis",
  /** PLACEHOLDER: NFT not live yet. ERC-721 collection on CHAIN. Empty = NFT reads off, site shows "launching soon". */
  address: "" as string,
  /** PLACEHOLDER: collection size. null = TBA. */
  supply: null as number | null,
  /** PLACEHOLDER: marketplace link. Empty hides the button. */
  marketUrl: "",
} as const;

/**
 * Allocation = min(txCount, txCap) x perTx  +  nftCount x perNft
 *
 * PLACEHOLDER: rates. `null` means not announced: the checker still reads and
 * shows the wallet's transactions and NFTs, but prints "TBA" for amounts.
 */
export const RATES = {
  /** Tokens per counted transaction. */
  perTx: null as number | null,
  /** Tokens per NFT held. */
  perNft: null as number | null,
  /** Max transactions counted per wallet (anti-farm). null = no cap. */
  txCap: null as number | null,
  /** A wallet needs at least this many transactions OR one NFT to qualify. */
  minTx: 1,
} as const;

/**
 * PLACEHOLDER: social handles. Empty strings remove the link everywhere
 * (header, footer, tasks). Handles only, no @.
 */
export const SOCIALS: { x: string; telegram: string; discord: string; post: string } = {
  x: "",
  telegram: "",
  discord: "", // full invite URL
  /** Optional post for the like + repost task (full URL). */
  post: "",
};

/** Extra campaign tasks shown after the social ones. */
export const EXTRA_TASKS: { id: string; label: string; detail: string; href: string }[] = [];

/** PLACEHOLDER: schedule. ISO strings in UTC, or null for "To be announced". */
export const SCHEDULE = {
  checkerOpens: "2026-11-09T00:00:00Z" as string | null,
  snapshotAt: null as string | null,
  claimOpensAt: null as string | null,
  /** Wallet submissions close at this time. null = open until announced. */
  submissionsCloseAt: null as string | null,
} as const;

/** True once an NFT address is configured here (server env POLYX_NFT_ADDRESS can also switch reads on). */
export const NFT_LIVE = /^0x[a-fA-F0-9]{40}$/.test(NFT.address);

export const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export const TBA = "TBA";

export const SITE_URL = (
  (import.meta.env?.VITE_SITE_URL as string | undefined) ?? `https://${PROJECT.domain}`
).replace(/\/+$/, "");
