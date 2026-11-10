import { cn } from "@/lib/format";

/** POLYX mark: a hexagon cut into six facets; opposite pairs share a colour so the cut reads as an X. */
export function Mark({ className, mono = false }: { className?: string; mono?: boolean }) {
  const c = { v: mono ? "currentColor" : "#C8FF4D", i: mono ? "currentColor" : "#7D6BFF", w: mono ? "currentColor" : "#F3F4F1" };
  return (
    <svg viewBox="0 0 32 32" className={cn("shrink-0", className)} aria-hidden="true">
      <g stroke="#08090B" strokeWidth="1.1" strokeLinejoin="round">
        <path d="M16 16 16 1 28.99 8.5Z" fill={c.v} />
        <path d="M16 16 28.99 8.5 28.99 23.5Z" fill={c.w} opacity={mono ? 0.35 : 0.16} />
        <path d="M16 16 28.99 23.5 16 31Z" fill={c.i} />
        <path d="M16 16 16 31 3.01 23.5Z" fill={c.v} />
        <path d="M16 16 3.01 23.5 3.01 8.5Z" fill={c.w} opacity={mono ? 0.35 : 0.16} />
        <path d="M16 16 3.01 8.5 16 1Z" fill={c.i} />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark className="size-7" />
      <span className="font-display text-[17px] font-semibold tracking-[0.08em] text-fg">POLYX</span>
    </span>
  );
}
