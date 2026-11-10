import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const APPKIT_STUB = fileURLToPath(new URL("./src/stubs/appkit-ssr.ts", import.meta.url));

/** Keep Reown AppKit (Lit, needs the DOM) out of every server bundle. */
function appkitServerStub(): Plugin {
  return {
    name: "polyx:appkit-server-stub",
    enforce: "pre",
    resolveId(id) {
      if (this.environment?.config?.consumer !== "server") return null;
      if (id === "@reown/appkit/react" || id === "@reown/appkit/networks" || id === "@reown/appkit-adapter-wagmi") return APPKIT_STUB;
      return null;
    },
  };
}

export default defineConfig(({ command, isPreview }) => ({
  server: { host: "0.0.0.0", port: 8080, strictPort: true },
  resolve: { tsconfigPaths: true },
  plugins: [
    appkitServerStub(),
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview ? [nitro({ preset: process.env.NITRO_PRESET ?? "vercel" })] : []),
    viteReact(),
  ],
}));
