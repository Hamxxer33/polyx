import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAllocation } from "./allocation.ts";

const R = { perTx: 250, perNft: 50_000, txCap: 2_000, minTx: 1 };

test("tx + nft breakdown", () => {
  const a = computeAllocation("0x1", 1284, 3, R);
  assert.equal(a.txTokens, 321_000);
  assert.equal(a.nftTokens, 150_000);
  assert.equal(a.total, 471_000);
  assert.equal(a.eligible, true);
  assert.equal(a.capped, false);
});

test("tx cap applies", () => {
  const a = computeAllocation("0x1", 5120, 1, R);
  assert.equal(a.countedTx, 2000);
  assert.equal(a.capped, true);
  assert.equal(a.total, 550_000);
});

test("empty wallet is not eligible", () => {
  const a = computeAllocation("0x1", 0, 0, R);
  assert.equal(a.eligible, false);
  assert.equal(a.total, 0);
});

test("NFT alone qualifies", () => {
  const a = computeAllocation("0x1", 0, 2, R);
  assert.equal(a.eligible, true);
  assert.equal(a.total, 100_000);
});

test("minTx threshold", () => {
  const a = computeAllocation("0x1", 4, 0, { ...R, minTx: 5 });
  assert.equal(a.eligible, false);
  assert.equal(a.txTokens, 0);
});

test("unannounced rates never invent numbers", () => {
  const a = computeAllocation("0x1", 300, 2, { perTx: null, perNft: null, txCap: null, minTx: 1 });
  assert.equal(a.txTokens, null);
  assert.equal(a.nftTokens, null);
  assert.equal(a.total, null);
  assert.equal(a.eligible, true);
});

test("one rate announced: total is not shown as final", () => {
  const a = computeAllocation("0x1", 10, 1, { perTx: 100, perNft: null, txCap: null, minTx: 1 });
  assert.equal(a.txTokens, 1000);
  assert.equal(a.nftTokens, null);
  assert.equal(a.total, 1000);
});
