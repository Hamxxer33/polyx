type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const Arrow = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const Check = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const Wallet = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h11.5v3" /><rect x="3.5" y="8" width="17" height="11" rx="2.5" /><path d="M16 13.5h1.5" /></svg>
);
export const Search = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
);
export const Copy = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" /><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" /></svg>
);
export const Shield = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 3.5 5 6v5.5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6l-7-2.5Z" /><path d="m9 12 2.2 2.2L15.5 10" /></svg>
);
export const Alert = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="8.5" /><path d="M12 8v5M12 16.2v.1" /></svg>
);
export const Plus = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 5v14M5 12h14" /></svg>
);
export const Spinner = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className + " animate-spin"} fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".2" strokeWidth="2.2" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
);
export const Lock = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></svg>
);
export const XLogo = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" /></svg>
);
export const TelegramLogo = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M21.5 4.3 18.4 19c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.6 13 2 11.6c-1-.3-1-1 .2-1.5L20.1 3.2c.8-.3 1.6.2 1.4 1.1Z" /></svg>
);
export const DiscordLogo = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M19.3 5.3A16.6 16.6 0 0 0 15.2 4l-.5 1a15.3 15.3 0 0 0-5.4 0l-.5-1a16.6 16.6 0 0 0-4.1 1.3C2 9.2 1.3 13 1.6 16.7a16.8 16.8 0 0 0 5 2.6l1.1-1.7c-.6-.2-1.2-.5-1.7-.9l.4-.3a11.9 11.9 0 0 0 11.2 0l.4.3c-.5.4-1.1.7-1.7.9l1.1 1.7a16.7 16.7 0 0 0 5-2.6c.4-4.3-.7-8-3.1-11.4ZM8.7 14.4c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" /></svg>
);
