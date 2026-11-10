import { FAQ } from "@/config/content";
import { Plus } from "@/components/icons";

export function Faq() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {FAQ.map((item, i) => (
        <details key={item.q} className="group" open={i === 0}>
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left sm:py-6">
            <span className="text-[16px] font-medium text-fg sm:text-[18px]">{item.q}</span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition duration-300 group-open:rotate-45 group-open:border-volt/50 group-open:text-volt">
              <Plus className="size-4" />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 text-[15px] leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
