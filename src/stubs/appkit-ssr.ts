// Server-side stand-in for Reown AppKit. AppKit ships Lit web components that touch
// HTMLElement at import time, which crashes SSR. The real package is only used in the
// browser (the checker flow is client-only), so the server build resolves to this file.
const net = (id: number) => ({ id, name: "", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: [] as string[] } } });
export const arbitrum = net(42161);
export const base = net(8453);
export const mainnet = net(1);
export const optimism = net(10);
export const polygon = net(137);
export type AppKitNetwork = ReturnType<typeof net>;
export function createAppKit() {
  return null;
}
export function useAppKit() {
  return { open: async () => {}, close: async () => {} };
}
export class WagmiAdapter {
  wagmiConfig: unknown = null;
  constructor(_: unknown) {}
}
