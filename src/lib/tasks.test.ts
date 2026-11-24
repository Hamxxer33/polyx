import { test } from "node:test";
import assert from "node:assert/strict";
import { buildTasks, prunedDone } from "./tasks.ts";

test("no socials means no tasks", () => {
  assert.deepEqual(buildTasks({ x: "", telegram: "", discord: "", post: "" }), []);
});

test("follow X, engage with the specified post, and join Telegram", () => {
  const post = "https://x.com/polyx_market/status/2125156016644108697?a=E1ZyTB-tZjgeXu_nzu4&s=19";
  const t = buildTasks({ x: "polyx_market", telegram: "polyxmarkets", discord: "", post });
  assert.deepEqual(t.map((x) => x.id), ["follow-x", "engage-launch-post", "telegram"]);
  assert.match(t[0].href, /screen_name=polyx/);
  assert.equal(t[1].label, "Like, comment & repost this post");
  assert.equal(t[1].href, post);
  assert.equal(t[2].href, "https://t.me/polyxmarkets");
});

test("prunes stale ticks", () => {
  const t = buildTasks({ x: "polyx", telegram: "", discord: "", post: "" });
  assert.deepEqual(prunedDone(["follow-x", "old", 3], t), ["follow-x"]);
  assert.deepEqual(prunedDone("nope", t), []);
});
