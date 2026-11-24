/** Social task list built only from accounts that are configured. Pure, no imports. */
export type Task = { id: string; label: string; detail: string; href: string; kind: "x" | "telegram" | "discord" | "link" };

export type TaskSources = {
  x: string;
  telegram: string;
  discord: string;
  post: string;
  extra?: readonly { id: string; label: string; detail: string; href: string }[];
};

export function buildTasks(s: TaskSources): Task[] {
  const out: Task[] = [];
  if (s.x) {
    out.push({
      id: "follow-x",
      label: `Follow @${s.x} on X`,
      detail: "Announcements, snapshot and claim dates land here first",
      href: `https://x.com/intent/follow?screen_name=${encodeURIComponent(s.x)}`,
      kind: "x",
    });
    if (s.post) {
      out.push({
        id: "engage-launch-post",
        label: "Like, comment & repost this post",
        detail: "Complete all three actions on the POLYX post",
        href: s.post,
        kind: "x",
      });
    }
  }
  if (s.telegram) {
    out.push({
      id: "telegram",
      label: `Join t.me/${s.telegram}`,
      detail: "Community chat and live updates",
      href: `https://t.me/${encodeURIComponent(s.telegram)}`,
      kind: "telegram",
    });
  }
  if (s.discord) {
    out.push({
      id: "discord",
      label: "Join the Discord",
      detail: "Roles, support and builder channels",
      href: s.discord,
      kind: "discord",
    });
  }
  for (const e of s.extra ?? []) {
    if (!e.id || !e.label || !e.href) continue;
    out.push({ ...e, kind: "link" });
  }
  return out;
}

/** Drop saved ticks for tasks that no longer exist. */
export function prunedDone(saved: unknown, tasks: readonly Task[]): string[] {
  if (!Array.isArray(saved)) return [];
  const ids = new Set(tasks.map((t) => t.id));
  return saved.filter((id): id is string => typeof id === "string" && ids.has(id));
}
