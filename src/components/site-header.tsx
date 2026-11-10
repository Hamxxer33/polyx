import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Arrow } from "@/components/icons";
import { cn } from "@/lib/format";

export function SiteHeader({ cta = true }: { cta?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="wrap flex h-16 items-center justify-between sm:h-[72px]">
        <Link to="/" aria-label="POLYX home" className="rounded-lg">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-[14px] text-muted md:flex">
          <a href="/#how" className="transition hover:text-fg">How it works</a>
          <a href="/#formula" className="transition hover:text-fg">Allocation</a>
          <a href="/#timeline" className="transition hover:text-fg">Timeline</a>
          <a href="/#faq" className="transition hover:text-fg">FAQ</a>
        </nav>
        {cta ? (
          <Link to="/check" className="btn-volt h-10 px-4 text-[14px] sm:px-5">
            Check allocation
            <Arrow className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </header>
  );
}
