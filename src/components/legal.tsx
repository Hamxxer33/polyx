import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PROJECT } from "@/config/polyx";

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: { h: string; body: ReactNode }[] }) {
  return (
    <div className="relative overflow-x-clip">
      <SiteHeader />
      <main className="wrap grid grid-cols-1 gap-10 pt-12 md:grid-cols-[0.6fr_1.4fr] md:pt-20">
        <aside className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow">Legal</p>
          <h1 className="h-display mt-4 text-[38px] leading-[1.02] sm:text-[52px]">{title}</h1>
          <p className="mt-4 text-[13px] text-faint">Last updated {PROJECT.legalUpdated}</p>
          <nav className="mt-8 hidden space-y-2 text-[14px] text-muted md:block">
            {sections.map((s, i) => (
              <a key={s.h} href={`#s${i + 1}`} className="block hover:text-fg">
                <span className="mr-3 font-mono text-[12px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                {s.h}
              </a>
            ))}
          </nav>
        </aside>
        <article className="max-w-2xl">
          <p className="text-[17px] leading-relaxed text-fg/90">{intro}</p>
          {sections.map((s, i) => (
            <section key={s.h} id={`s${i + 1}`} className="mt-10 border-t border-line pt-8">
              <h2 className="flex items-baseline gap-3 text-[18px] font-medium">
                <span className="font-mono text-[12px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                {s.h}
              </h2>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">{s.body}</div>
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
