/** Pure allocation math. No imports so it runs under `node --test` as is. */

export type Rates = {
  perTx: number | null;
  perNft: number | null;
  txCap: number | null;
  minTx: number;
};

export type Allocation = {
  wallet: string;
  txCount: number;
  countedTx: number;
  nftCount: number;
  /** null when the matching rate is not announced yet. */
  txTokens: number | null;
  nftTokens: number | null;
  total: number | null;
  eligible: boolean;
  capped: boolean;
  rates: Rates;
};

export function computeAllocation(wallet: string, txCount: number, nftCount: number, rates: Rates): Allocation {
  const tx = Math.max(0, Math.floor(txCount));
  const nft = Math.max(0, Math.floor(nftCount));
  const countedTx = rates.txCap != null ? Math.min(tx, rates.txCap) : tx;
  const eligible = tx >= Math.max(1, rates.minTx) || nft > 0;
  const txTokens = rates.perTx == null ? null : eligible ? countedTx * rates.perTx : 0;
  const nftTokens = rates.perNft == null ? null : nft * rates.perNft;
  const total =
    txTokens == null && nftTokens == null
      ? null
      : (txTokens ?? 0) + (nftTokens ?? 0);
  return {
    wallet,
    txCount: tx,
    countedTx,
    nftCount: nft,
    txTokens,
    nftTokens,
    total,
    eligible,
    capped: rates.txCap != null && tx > rates.txCap,
    rates,
  };
}
