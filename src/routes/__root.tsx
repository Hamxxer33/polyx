import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { CHAIN, PROJECT, SITE_URL, TOKEN } from "@/config/polyx";

const TITLE = `${PROJECT.name} · Check your allocation`;
const DESC = `${PROJECT.name} rewards real ${CHAIN.longName} wallets. See your ${TOKEN.symbol} allocation from your transactions and NFTs, read live from the chain.`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "theme-color", content: "#08090B" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: PROJECT.name },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:image", content: `${SITE_URL}/og.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: `${SITE_URL}/og.png` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  component: () => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});
