import { CHAIN, NFT, PROJECT, RATES, SCHEDULE, TOKEN } from "@/config/polyx";
import { fmt, fmtDate } from "@/lib/format";

const rateTx = RATES.perTx != null ? `${fmt(RATES.perTx)} ${TOKEN.symbol}` : "a per-transaction rate (announced soon)";
const rateNft = RATES.perNft != null ? `${fmt(RATES.perNft)} ${TOKEN.symbol}` : "a per-NFT rate (announced soon)";
const snapshot = fmtDate(SCHEDULE.snapshotAt) ?? "a date we will announce on our channels";
const claim = fmtDate(SCHEDULE.claimOpensAt) ?? "a date we will announce on our channels";

export const FAQ: { q: string; a: string }[] = [
  {
    q: `What is ${PROJECT.name}?`,
    a: `${PROJECT.name} is a community token distribution that rewards wallets for what they have already done on ${CHAIN.longName}. There is no presale and nothing to buy to qualify. The checker reads public on-chain data and shows what your wallet is worth in the drop.`,
  },
  {
    q: "How is my allocation calculated?",
    a: `Two parts, added together. Every transaction your wallet has sent on ${CHAIN.longName} earns ${rateTx}, and every ${NFT.name} NFT you hold earns ${rateNft}.${RATES.txCap != null ? ` Transactions are counted up to ${fmt(RATES.txCap)} per wallet.` : ""} Both numbers are read live from the chain when you check.`,
  },
  {
    q: "Which wallet should I check?",
    a: `The wallet you actually use on ${CHAIN.longName}. Paste any public address or connect a wallet. Checking is read only: we never ask you to sign a transaction or approve anything on this page.`,
  },
  {
    q: `Do I need a ${NFT.name} NFT?`,
    a: "No. Transactions alone qualify a wallet. Holding NFTs adds a second, separate bonus on top. A wallet with no transactions still qualifies if it holds at least one NFT.",
  },
  {
    q: "What happens when I submit my wallet?",
    a: `We record the address so it is included when the final list is built at the snapshot. Submitting is free, needs no signature and can be done once per wallet. Only the public address is stored.`,
  },
  {
    q: "When is the snapshot and when can I claim?",
    a: `The snapshot is on ${snapshot}. Claiming opens on ${claim}. Activity after the snapshot does not count, and the official claim link will only ever be posted on ${PROJECT.domain} and our verified channels.`,
  },
  {
    q: "Is the number on the checker final?",
    a: "It is an estimate from live chain data. The final amount is fixed at the snapshot, and wallets that look automated or sybil may be filtered out before the list is published.",
  },
  {
    q: "How do I stay safe?",
    a: `Only use ${PROJECT.domain}. The team will never DM you first, never ask for your seed phrase or private key, and never ask you to send funds to qualify.`,
  },
];
