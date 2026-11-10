# POLYX allocation checker

Premium airdrop checker for **POLYX**, operated by **Presdency**. Same model as the Ventran checker
(www.ventran.xyz): a wallet's allocation is computed from its on-chain transaction count plus its NFT
balance, visitors complete social steps, and the wallet is filed to a Google Form.

```
allocation = min(txCount, txCap) x perTx  +  nftBalance x perNft
```

## Stack

TanStack Start (React 19, SSR, server functions) · Tailwind CSS v4 · viem for chain reads ·
wagmi + Reown AppKit for "Connect wallet" · Nitro (Vercel preset) · Playwright for screenshots.
Fonts: Unbounded (display), Geist and Geist Mono (self-hosted via Fontsource).

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing: hero, specs, how it works, allocation formula, timeline, safety, FAQ, CTA |
| `/check` | Checker: paste or connect wallet, breakdown, social steps, submit (lock in) |
| `/terms`, `/privacy` | Legal, operator Presdency |
| `/api/submit` | POST `{ wallet, allocation }`, files the wallet to Google Forms |
| anything else | Branded 404 |

## Plug in the real details (one file)

Everything lives in **`src/config/polyx.ts`**. Each value marked `PLACEHOLDER` is waiting on the team.
Leaving a value `null` or `""` is always safe: the site shows "TBA" or hides the link, it never invents numbers.

| Setting | Where | Notes |
| --- | --- | --- |
| Chain | `PROJECT.chain` | `arbitrum`, `base`, `ethereum`, `optimism` or `polygon` (presets in `CHAINS`) |
| Domain | `PROJECT.domain` | Shown in safety notices and OG tags |
| Contact email | `PROJECT.contactEmail` | Empty hides it |
| Token name, ticker, address, supply, airdrop % | `TOKEN` | Address empty = not deployed |
| NFT name, address, supply, marketplace link | `NFT` | Address can also be set with env `POLYX_NFT_ADDRESS` |
| Rates | `RATES.perTx`, `RATES.perNft` | `null` = "TBA" (counts still shown) |
| Transaction cap / minimum | `RATES.txCap`, `RATES.minTx` | Cap `null` = no cap |
| Socials | `SOCIALS.x`, `.telegram`, `.discord`, `.post` | Drive the header, footer and task list |
| Extra tasks | `EXTRA_TASKS` | One-off campaign posts |
| Dates | `SCHEDULE` | ISO strings in UTC or `null` = "To be announced" |

FAQ copy is in `src/config/content.ts` and reads the values above automatically.

## Environment variables

Copy `.env.example`. Nothing here is secret except your RPC key if the URL contains one.

| Name | Side | Purpose |
| --- | --- | --- |
| `POLYX_RPC_URL` | server | Private RPC (Alchemy, QuickNode...). Defaults to the chain's public RPC |
| `POLYX_NFT_ADDRESS` | server | NFT collection, overrides `NFT.address` without a code change |
| `GOOGLE_FORM_ACTION` | server | `https://docs.google.com/forms/d/e/<id>/formResponse` |
| `GOOGLE_FORM_WALLET_ENTRY` | server | `entry.<number>` of the wallet question |
| `GOOGLE_FORM_ALLOCATION_ENTRY` | server | optional `entry.<number>` for the computed allocation |
| `VITE_WALLETCONNECT_PROJECT_ID` | client | Reown project id from cloud.reown.com. Without it, Connect uses the browser wallet |
| `VITE_SITE_URL` | client | Public origin for OG tags, e.g. `https://polyx.xyz` |

### Google Form

1. Create a form with a short-answer question "Wallet" (and optionally "Allocation").
2. Open *Get pre-filled link*, fill dummy values, copy the link. The `entry.123...` numbers are the entry ids.
3. Action URL is the form URL with `/viewform` replaced by `/formResponse`.

If Google rate-limits the server (HTTP 429), the API returns the public form fields and the browser files the entry itself.
Without a form configured: local dev writes to `.local/submissions.jsonl`; production answers "Submissions are not open yet".

## Run locally

```bash
npm install
npm run dev          # http://localhost:8080
```

Demo mode for previews: `http://localhost:8080/check?demo=1` uses example rates (250 per tx, 50,000 per NFT, cap 2,000),
example socials and a mock wallet. Demo wallets (in `src/config/demo.ts`):

| Wallet | Result |
| --- | --- |
| `0x7A3f9C2b0E61d4A85B19c0e3F2D6a7b84c51E9d2` | 1,284 tx + 3 NFTs (also the "Connect wallet" mock) |
| `0x5b2e81c4f09a7d3e6b1c8a24f5d90e3c7a6b4f10` | 214 tx, no NFT |
| `0x9c4d2a71e8b05f3c6d9e1a2b7f48c0d35e6a1b72` | 5,120 tx, capped at 2,000 |
| `0x0f1e2d3c4b5a69788796a5b4c3d2e1f00f1e2d3c` | Empty wallet, not eligible |
| `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee` | RPC error |
| `0xbad0000000000000000000000000000000000001` | Eligible, submit fails |

`/check?wallet=0x...` pre-fills and checks a wallet (works in live mode too).

## Checks

```bash
npm test             # allocation math + task list (node --test)
npm run typecheck
npm run check:copy   # fails on any em or en dash in src/, public/, README
npm run og           # regenerates public/og.png + PNG icons (dev server running)
npm run shots        # every screen and state, mobile + desktop, into shots/ (dev server running)
```

`APPKIT_BASE=http://localhost:8082 npm run shots` also captures the Reown wallet picker, from a second dev server
started with `VITE_WALLETCONNECT_PROJECT_ID` set.

## Deploy (Vercel)

1. Push this repo to GitHub and import it in Vercel (framework preset: Other; build command `npm run build`).
   The Nitro Vercel preset outputs `.vercel/output` automatically.
2. Set the environment variables above for Production.
3. Add the custom domain and update `PROJECT.domain` / `VITE_SITE_URL`.
4. After deploy, open `/check?wallet=<a real wallet>` and confirm the counts, then submit a test wallet and
   confirm it lands in the form responses.

To run the production build on any Node host instead: `NITRO_PRESET=node-server npm run build && npm start`.

## Notes

- Reown AppKit uses Lit web components that cannot run during SSR. The checker flow is loaded client-side
  (`src/components/checker-client.tsx`) and `vite.config.ts` points server builds at `src/stubs/appkit-ssr.ts`.
- Tasks are self-attested and stored in the visitor's browser; the API never trusts them.
- The server never stores checked wallets. Only submitted wallets are sent to the form.

## Brand

`public/brand/` has the mark, icon and logo SVGs. Palette: ink `#08090B`, volt `#C8FF4D`, iris `#7D6BFF`, paper `#F3F4F1`.
The mark is a hexagon cut into six facets; opposite facets share a colour so the cuts read as an X.
