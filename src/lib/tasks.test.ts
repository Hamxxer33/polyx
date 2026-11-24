import { test } from "node:test";
import assert from "node:assert/strict";
import { buildTasks, prunedDone } from "./tasks.ts";

test("no socials means no tasks", () => {
  assert.deepEqual(buildTasks({ x: "", telegram: "", discord: "", post: "" }), []);
});

test("follow X, join Telegram, and optional post task", () => {
  const t = buildTasks({ x: "polyx", telegram: "polyxchat", discord: "", post: "https://x.com/polyx/status/1" });
  assert.deepEqual(t.map((x) => x.id), ["follow-x", "repost", "telegram"]);
  assert.match(t[0].href, /screen_name=polyx/);
});

test("prunes stale ticks", () => {
  const t = buildTasks({ x: "polyx", telegram: "", discord: "", post: "" });
  assert.deepEqual(prunedDone(["follow-x", "old", 3], t), ["follow-x"]);
  assert.deepEqual(prunedDone("nope", t), []);
});
