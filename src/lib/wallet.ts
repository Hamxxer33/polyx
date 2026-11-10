import { createAppKit } from "@reown/appkit/react";
import { arbitrum, base, mainnet, optimism, polygon, type AppKitNetwork } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createConfig, http, injected, mock } from "wagmi";
import { PROJECT, SITE_URL } from "@/config/polyx";
import { DEMO_CONNECTED } from "@/config/demo";

const NETWORKS = { arbitrum, base, ethereum: mainnet, optimism, polygon } as const;
export const NETWORK = NETWORKS[PROJECT.chain] as AppKitNetwork;

export const WC_PROJECT_ID = ((import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined) ?? "").trim();
export const HAS_APPKIT = WC_PROJECT_ID.length > 0;

let adapter: WagmiAdapter | null = null;

/**
 * Reown AppKit when a project id is set (MetaMask, Rabby, Coinbase, WalletConnect QR, ...).
 * Without one, wagmi falls back to the browser's injected wallet so the button still works.
 * createAppKit runs once, at import, before any useAppKit hook mounts.
 */
if (HAS_APPKIT) {
  adapter = new WagmiAdapter({ networks: [NETWORK], projectId: WC_PROJECT_ID, ssr: true });
  createAppKit({
    adapters: [adapter],
    networks: [NETWORK, ...[]] as [AppKitNetwork, ...AppKitNetwork[]],
    projectId: WC_PROJECT_ID,
    metadata: {
      name: PROJECT.name,
      description: `${PROJECT.name} allocation checker`,
      url: SITE_URL,
      icons: [`${SITE_URL}/icon-512.png`],
    },
    features: { analytics: false, email: false, socials: false, swaps: false, onramp: false },
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#C8FF4D",
      "--w3m-color-mix": "#08090B",
      "--w3m-color-mix-strength": 30,
      "--w3m-border-radius-master": "2px",
      "--w3m-font-family": "Geist Variable, ui-sans-serif, system-ui",
    },
  });
}

export function makeWagmiConfig(demo: boolean) {
  if (demo) {
    return createConfig({
      chains: [NETWORK as never],
      connectors: [mock({ accounts: [DEMO_CONNECTED] })],
      transports: { [NETWORK.id]: http() } as never,
      ssr: true,
    });
  }
  if (adapter) return adapter.wagmiConfig;
  return createConfig({
    chains: [NETWORK as never],
    connectors: [injected({ shimDisconnect: true })],
    transports: { [NETWORK.id]: http() } as never,
    ssr: true,
  });
}
