import { SOCIALS } from "@/config/polyx";
import { DiscordLogo, TelegramLogo, XLogo } from "@/components/icons";

export const SOCIAL_LINKS = [
  SOCIALS.x && { id: "x", label: `@${SOCIALS.x} on X`, href: `https://x.com/${SOCIALS.x}`, Icon: XLogo },
  SOCIALS.telegram && { id: "tg", label: "Telegram", href: `https://t.me/${SOCIALS.telegram}`, Icon: TelegramLogo },
  SOCIALS.discord && { id: "dc", label: "Discord", href: SOCIALS.discord, Icon: DiscordLogo },
].filter(Boolean) as { id: string; label: string; href: string; Icon: typeof XLogo }[];

/** Social buttons. When no handles are configured yet, shows quiet "soon" placeholders. */
export function SocialRow() {
  if (SOCIAL_LINKS.length === 0) {
    return (
      <div className="flex items-center gap-2">
        {[XLogo, TelegramLogo, DiscordLogo].map((Icon, i) => (
          <span key={i} title="Link coming soon" className="grid size-10 place-items-center rounded-full border border-line text-faint">
            <Icon className="size-4" />
          </span>
        ))}
        <span className="ml-1 font-mono text-[11px] tracking-wider text-faint uppercase">Channels soon</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
        <a key={id} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-white/25 hover:text-fg">
          <Icon className="size-4" />
        </a>
      ))}
    </div>
  );
}
