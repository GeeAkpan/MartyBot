# Marty Bot website

Landing page for [@martytraderbot](https://t.me/martytraderbot), built with **React 19 + TypeScript + Vite** and styled with **Sass (SCSS modules)**.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
npm run preview   # serve the production build
node scripts/gen-qr.mjs   # regenerate the Telegram QR code if the bot link changes
```

`dist/` is plain static files. Deploy it to Vercel, Netlify, Cloudflare Pages or any host.
On Vercel: import the repo, framework preset **Vite**, no extra config needed.

## Live site

Deployed on Vercel from the `main` branch. Every push to `main` redeploys automatically.

## Edit the copy

All text, links, partners, chains and FAQs live in **`src/content.ts`**.
Anything in `[BRACKETS]` is a placeholder. **Placeholders are hidden on the live site automatically** until you fill them in:

- fees, wallet export, $MARS details (chain, contract, where to buy)
- docs, community and partner-contact links
- confirm the X handle (`@matarabot`)
- if you add a custom domain, update the URLs (currently https://martybot-ashen.vercel.app) in `index.html`, `public/robots.txt` and `public/sitemap.xml`

## "Try Marty" playground (`#try`)

An interactive demo of the bot inside the site. Visitors get a demo wallet on any of the 8 chains and can
`/start`, paste a contract, buy (presets or Buy X), sell, set limit buys, take-profit and stop-loss, and copy a wallet.
A simulated price ticks every second, and *Pump / Dump* buttons let them trigger orders on demand.

- Logic: `src/sim/engine.ts` (pure reducer, easy to test or extend) + `src/sim/useMartySim.ts` (timers).
- UI: `src/components/playground/`.
- **Everything is simulated in the browser.** No wallet, chain or bot API is touched, and the UI is labelled "Demo · no real funds".

## Structure

```
src/
  content.ts               ← all copy and links
  styles/
    abstracts/_tokens.scss ← colors, fonts, spacing, radii, breakpoints
    abstracts/_mixins.scss ← up()/down() breakpoints, fluid() clamp, container, card, motion-ok…
    global.scss            ← tokens → CSS custom properties, reset, utilities, scroll reveal
  components/              ← one .tsx + .module.scss per section
  hooks/useReveal.ts       ← IntersectionObserver scroll reveal
  sim/                     ← playground simulation engine
```

### Sass conventions

- Modern module system only: `@use` / `@forward` (no `@import`).
- Every module starts with `@use 'abstracts' as *;` (resolved via `loadPaths` in `vite.config.ts`).
- Colors via `c('gold')`, which outputs `var(--c-gold)` so they're themeable at runtime.
- Spacing via `space(4)`, radii via `radius('lg')`, fluid sizes via `fluid(min-px, max-px)`.
- Mobile-first breakpoints: `@include up('md') { … }`.
- Motion is wrapped in `@include motion-ok`, so it respects `prefers-reduced-motion`.

## Conversion features

- Hero with one primary action (open the bot) and a secondary "Try the demo".
- "Old way vs Marty" comparison, an interactive demo, then features, partners and FAQ.
- Mobile sticky "Open" bar that hides near the hero, the demo, the final CTA and the footer.
- Desktop QR code so visitors can jump to Telegram on their phone.
- Vercel Web Analytics (`@vercel/analytics`). Enable it in the Vercel dashboard → Analytics.
- Open Graph / X share card (`public/og-image.jpg`), JSON-LD, robots.txt and sitemap.

## Notes

- Fonts (Russo One, Poppins) are self-hosted via Fontsource, so there are no third-party requests.
- Accessible: skip link, semantic landmarks, real buttons/links, ARIA on the menu and FAQ, visible focus rings, AA contrast.
