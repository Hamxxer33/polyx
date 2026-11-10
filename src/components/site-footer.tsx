import { Link } from "@tanstack/react-router";
import { PROJECT } from "@/config/polyx";
import { Mark } from "@/components/logo";
import { SocialRow } from "@/components/socials";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line">
      <div className="wrap grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Mark className="size-7" />
            <span className="font-display text-[17px] font-semibold tracking-[0.08em]">POLYX</span>
          </div>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">
            Rewards cut from real on-chain activity. Check your wallet, complete the steps, lock in your spot.
          </p>
          <div className="mt-6">
            <SocialRow />
          </div>
        </div>
        <div>
          <p className="eyebrow">Product</p>
          <ul className="mt-4 space-y-2.5 text-[14px] text-muted">
            <li><Link to="/check" className="hover:text-fg">Allocation checker</Link></li>
            <li><a href="/#formula" className="hover:text-fg">How allocation works</a></li>
            <li><a href="/#faq" className="hover:text-fg">FAQ</a></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Legal</p>
          <ul className="mt-4 space-y-2.5 text-[14px] text-muted">
            <li><Link to="/terms" className="hover:text-fg">Terms of use</Link></li>
            <li><Link to="/privacy" className="hover:text-fg">Privacy</Link></li>
            {PROJECT.contactEmail ? (
              <li><a href={`mailto:${PROJECT.contactEmail}`} className="hover:text-fg">{PROJECT.contactEmail}</a></li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-line py-6 text-[12px] text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {PROJECT.name}. All rights reserved.</p>
        <p>Only trust {PROJECT.domain}. We will never DM you first or ask for a seed phrase.</p>
      </div>
    </footer>
  );
}
