# Project: Mboa Website — Astro Showcase Site

> Public showcase website for the Mboa project — a Cameroonian real estate intermediation platform.
> Astro (static) + React islands, bilingual FR/EN, deployed on Cloudflare Workers (static assets).
> Content source of truth: the production docs in `MyHome/` (see *Source Documents*). Brand: `Doc 05` (graphic charter), `Doc 06` (brandbook).

Guiding principle: **fast on a Cameroonian 3G connection, faithful to the docs, on-brand** — every page ships as static HTML, every claim traces back to a production doc or a founder decision, every pixel respects the charter.

---

# Purpose & Audiences

Goals, in priority order (founder decision, 2026-10-27):

1. **Present and show the project** — what Mboa is, why it exists, how it works.
2. **Recruit providers (owners, agencies) and field agents** — dedicated pages and forms.
3. **Announce the availability date** of the product (MVP date, editable by the founder — see *Founder-Editable Settings*).

**Primary call to action everywhere: the waitlist** (apps are not live yet). The waitlist goes online first; the rest of the site follows.

Audiences: curious visitors · tenants · owners & agencies · agents · investors & partners.

---

# Tech Stack

| Layer | Technology | Version | Role |
|-------|-----------|---------|------|
| Framework | **Astro** | 7.x | Static generation by default, file-based routing, i18n routing. `build.format: "file"` + `trailingSlash: "never"` (`/en/index.astro` → `/en.html`, served at `/en`) |
| Adapter | **@astrojs/cloudflare** | latest | On-demand routes only where needed (API endpoints, CMS admin, deep-link fallback) |
| Interactive islands | **React** | 19.x | Only for components that need client-side state (forms, counter, carousel) |
| Language | **TypeScript** | 5.x (strict) | `astro/tsconfigs/strict` |
| Styling | **Tailwind CSS** | 4.x | Utility classes, Mboa tokens declared in `@theme` |
| Content | **Astro Content Collections** (Markdown / MDX / YAML) | bundled | Pages copy, legal pages, FAQ, news, team, settings — typed with Zod |
| CMS | **Keystatic** (GitHub mode) | latest | Non-developer editing of collections; every save = a commit → rebuild. *Planned — added after the waitlist launch* |
| i18n | Astro built-in i18n routing + `src/i18n/` dictionaries | bundled | FR (default) + EN |
| Animations | Native CSS (scroll-driven animations, cross-document View Transitions) + **Motion** (`motion`, vanilla) | latest | Rich but light — see *Animations* |
| Images | **astro:assets** (`<Image>`, `<Picture>`) | bundled | AVIF/WebP, responsive `srcset`, lazy loading |
| Fonts | **Astro Fonts API** (`fontProviders.fontsource()`) | bundled | Plus Jakarta Sans (display) + Inter (body), downloaded at build and self-hosted — no Google Fonts CDN. Used via `<Font cssVariable=… />` in `BaseLayout` |
| Icons | **astro-icon** + `@iconify-json/lucide` · `lucide-react` in islands | — | Lucide outline icons (Doc 05 §5.1) |
| SEO | `@astrojs/sitemap` + JSON-LD helpers | — | Sitemap, hreflang, Open Graph, structured data |
| Forms backend | Astro API routes (`prerender = false`) + **Cloudflare Turnstile** | — | Server-side validation, privacy-friendly anti-spam |
| Mailing / lists | **Brevo** (API v3) | — | Waitlist, pioneer providers, agents — one list each, double opt-in |
| Analytics | **Cloudflare Web Analytics** | — | Cookieless — no consent banner required |
| Hosting | **Cloudflare Workers** (static assets) | — | CDN, HTTPS, preview URL per branch. The Cloudflare adapter no longer supports Pages (Astro 6+). Config in `wrangler.jsonc` |
| Lint / Format | ESLint (`eslint-plugin-astro`, `jsx-a11y`) + Prettier (`prettier-plugin-astro`, `prettier-plugin-tailwindcss`) | — | — |
| Testing | **Vitest** (utils, endpoints) · **Playwright** + `@axe-core/playwright` (e2e, a11y) · **Lighthouse CI** | — | Vitest uses a plain Vite config (Astro's `getViteConfig()` loads the Cloudflare plugin, which rejects Vitest). Playwright runs the installed Google Chrome locally (`channel: "chrome"`), Playwright's Chromium in CI |
| Runtime | **Node.js** | ≥ 22.12 | Build tooling only |
| Package manager | **npm** | bundled with Node | One `package-lock.json`, committed |

---

# Source Documents

The site's content is **not invented** — it is drawn from the production docs in
`/Users/lvmmarket/Documents/Claude/Projects/MyHome/` or from explicit founder decisions. Read the source doc before writing a page.

| Topic | Source doc |
|-------|-----------|
| Vision, mission, values, phases | `Mboa_Doc01_Cadrage_Strategique.md` |
| Target cities, personas (qualitative only — see *Public vs Internal*) | `Mboa_Doc02_Etude_de_Marche_et_Personas.md` |
| Needs, user stories | `Mboa_Doc04_Analyse_des_Besoins_User_Stories.md` |
| Colors, typography, components, tone of voice | `Mboa_Doc05_Charte_Graphique.md` |
| Manifesto, brand phrases, brand architecture, photography | `Mboa_Doc06_Brandbook.md` |
| Pricing tiers | `Mboa_Doc08_Strategie_Monetisation.md` §2.1 |
| Features of the apps (modules M01–M31) | `Mboa_Doc10_CDC_Fonctionnel.md` |
| Management app — delegated management (M28) | `Mboa_Doc10_CDC_Fonctionnel.md` M28 · `Mboa_Doc01` §6.4 |
| Roadmap, phases | `Mboa_Doc15_Roadmap.md` (dates: founder settings override the doc) |
| Terms of use, privacy policy, cancellation policy | `Mboa_Doc16_CGU_RGPD.md` |
| Launch messages per target, pioneer program | `Mboa_Doc18_Go_To_Market.md` §1, §5 |
| Data protection (ANTIC, e-commerce law) | `Mboa_Doc19_Cadre_Juridique.md` §2, §4 |
| Waitlist mechanics, content strategy, news material | `Mboa_Doc20_Strategie_Contenu_Communaute.md` · `Réseaux sociaux/*/Post_*.md` |
| Pending / settled decisions | `Mboa_Decisions_A_Finaliser.md` |
| Brand assets (SVG/PNG logos, per-product logos) | `Mboa brand identity kit 2/logo-v2/` (v2 is final — ignore `pistes/`) |
| Layout reference (style **and** structure) | `docs/references/layout-reference.webp` (this repo) |

> **Absolute rule:** if a doc and the site disagree, the doc wins — unless a founder decision recorded in this file says otherwise. Never "improve" a figure, a price, a date or a legal clause.

---

# Site Map

FR is unprefixed, EN lives under `/en/` with localized slugs (`src/i18n/routes.ts`).

| Page | FR | EN | Main sources |
|------|----|----|--------------|
| Home | `/` | `/en/` | Doc 01, 05, 06, 18 |
| The project — problem, needs, goal, approach | `/le-projet` | `/en/the-project` | Doc 01, 04, 06 manifesto |
| The market — cities and segments, **no figures** | `/le-marche` | `/en/the-market` | Doc 01 §7, Doc 02 (qualitative) |
| Who it's for — overview of all audiences | `/pour-qui` | `/en/who-its-for` | Doc 02 §5–6, Doc 18 §1.2 |
| Owners & agencies — recruitment + pioneer form | `/proprietaires` | `/en/owners` | Doc 18 §1.2, §5 |
| Agents — recruitment + agent form | `/devenir-agent` | `/en/become-an-agent` | Doc 18 §1.2, Doc 10 (agent modules) |
| The apps — overview | `/applications` | `/en/apps` | Doc 06 §1.5, Doc 10 |
| App Mboa (tenants) | `/applications/mboa` | `/en/apps/mboa` | Doc 10, Doc 06 §2.1 |
| App Mboa Pro (providers & agents) | `/applications/mboa-pro` | `/en/apps/mboa-pro` | Doc 10 |
| Management app (M28) — **"coming soon"** | `/applications/<slug TBD>` | `/en/apps/<slug TBD>` | Doc 10 M28, Doc 01 §6.4 |
| Trust & safety — KYC, badges, Contrat Mboa, Mboa Score, certified agents | `/confiance` | `/en/trust` | Doc 10, Doc 18 §1.3 (without competitors) |
| Pricing — "subject to change" | `/tarifs` | `/en/pricing` | Doc 08 §2.1 |
| Roadmap — with MVP date from settings | `/feuille-de-route` | `/en/roadmap` | Doc 15, settings |
| Vision — Phase 2 Coliving & Séjours | `/vision` | `/en/vision` | Doc 01 §6, Doc 06 |
| About — manifesto, mission, values, team | `/a-propos` | `/en/about` | Doc 01 §3, Doc 06 §0, §1.4, team collection |
| Investors & partners | `/investisseurs` | `/en/investors` | Doc 01, Doc 06 — **no financials** |
| News | `/actualites`, `/actualites/[slug]` | `/en/news`, `/en/news/[slug]` | news collection |
| Press kit | `/presse` | `/en/press` | brand kit, Doc 06 §1.3 |
| FAQ | `/faq` | `/en/faq` | faq collection |
| Waitlist | `/liste-d-attente` | `/en/waitlist` | Doc 20 §6 |
| Contact | `/contact` | `/en/contact` | settings |
| Legal notice | `/mentions-legales` | `/en/legal-notice` | settings, Doc 19 |
| Terms of use | `/cgu` | `/en/terms` | Doc 16 part 1 |
| Privacy policy | `/confidentialite` | `/en/privacy` | Doc 16 part 2 + website-specific data (forms, analytics) |
| Cancellation policy | `/annulation` | `/en/cancellation` | Doc 16 part 3 |
| 404 | `/404` | — | — |

**The three apps presented** are App Mboa, App Mboa Pro and the management app (M28, delegated management). **Mboa Admin is never presented.**

---

# Project Structure

```
site-vitrine/
├── astro.config.mjs              # integrations (react, sitemap, icon), cloudflare adapter, i18n, site URL
├── tsconfig.json                 # extends astro/tsconfigs/strict
├── wrangler.jsonc                # Cloudflare Workers config (name, vars, 404 handling) — no secrets
├── keystatic.config.ts           # CMS schema mirroring the content collections (added later)
├── scripts/                      # one-off build helpers (generate-og.mjs)
├── public/
│   ├── .well-known/
│   │   ├── apple-app-site-association   # iOS Universal Links (no extension)
│   │   └── assetlinks.json              # Android App Links
│   ├── _headers                  # Cloudflare headers (AASA content-type, security headers, cache)
│   ├── robots.txt
│   └── favicon / og fallback images
├── docs/
│   └── references/               # design references (not shipped)
├── src/
│   ├── assets/
│   │   ├── brand/                # logos copied from the brand kit (SVG first)
│   │   ├── images/               # photos — processed by astro:assets
│   │   └── apps/                 # app screenshots supplied by the founder
│   ├── components/
│   │   ├── ui/                   # Button, Badge, Card, Container, SectionHeading, Icon, PhotoPlaceholder…
│   │   ├── layout/               # Header, Footer, MobileNav, LanguageSwitcher, SkipLink
│   │   ├── sections/             # WaitlistCount (vanilla JS), home/ (Hero, AppsShowcase, TrustFeatures, Audiences,
│   │   │                         # RoadmapTeaser, FounderStory, Values, FinalCta), later Pricing, Faq…
│   │   ├── brand/                # BrandPattern (M monogram texture), DecorDiscs, Logo
│   │   ├── views/                # One view per page, shared by the FR and EN route files (HomeView…)
│   │   └── islands/              # React components — the ONLY place component JS lives
│   │       ├── WaitlistForm.tsx
│   │       ├── PioneerForm.tsx
│   │       ├── AgentForm.tsx
│   │       └── ContactForm.tsx
│   ├── content/
│   │   ├── settings/site.yaml    # FOUNDER-EDITABLE values (see below)
│   │   ├── legal/{fr,en}/        # cgu, confidentialite, annulation, mentions-legales
│   │   ├── faq/{fr,en}/
│   │   ├── news/{fr,en}/
│   │   └── team/                 # one entry per team member (photo, role FR/EN, links)
│   ├── content.config.ts         # Zod schemas for every collection
│   ├── i18n/
│   │   ├── fr.json               # UI strings — French (default locale)
│   │   ├── en.json               # UI strings — English (same keys, always)
│   │   ├── routes.ts             # localized slug map (/a-propos ↔ /en/about)
│   │   └── utils.ts              # t(), getLocale(), localizedPath()
│   ├── layouts/
│   │   ├── BaseLayout.astro      # <head> (SEO, hreflang, OG, JSON-LD), Header, Footer
│   │   └── LegalLayout.astro     # long-form legal text, table of contents, last-updated date
│   ├── lib/
│   │   ├── settings.ts           # typed accessor for content/settings/site.yaml
│   │   ├── seo.ts                # meta builders, canonical URLs
│   │   ├── jsonld.ts             # Organization, MobileApplication, FAQPage schemas
│   │   ├── brevo.ts              # server-only Brevo client (contacts, list counts)
│   │   └── animations.ts         # shared Motion helpers (inView reveals) — one small script
│   ├── pages/
│   │   ├── index.astro           # FR pages (default locale, unprefixed)
│   │   ├── …
│   │   ├── en/                   # EN pages (prefixed /en/)
│   │   ├── api/                  # on-demand endpoints (prerender = false)
│   │   │   ├── waitlist.ts       # POST
│   │   │   ├── pioneers.ts       # POST
│   │   │   ├── agents.ts         # POST
│   │   │   ├── contact.ts        # POST
│   │   │   └── waitlist-count.ts # GET — cached 1 h
│   │   └── 404.astro
│   └── styles/
│       └── global.css            # @import "tailwindcss" + @theme tokens + @font-face + motion CSS
└── tests/
    ├── unit/                     # Vitest — i18n key parity, route map, settings schema, endpoints
    └── e2e/                      # Playwright — navigation, language switch, forms, axe a11y
```

> **Absolute rule:** pages are composed of **sections**, sections of **ui** components. A page file contains layout + section composition + content lookups — no raw styling soup, no business logic.
> Route files in `src/pages/` stay thin: they render the page's view (`src/components/views/`) with a `locale` prop, so FR and EN never diverge.

---

# Founder-Editable Settings

Every value the founder may change before a deploy lives in **one file**: `src/content/settings/site.yaml` (Zod-validated, later editable through Keystatic). Never hardcode these anywhere else.

| Key | Example | Notes |
|-----|---------|-------|
| `launch.mvpDate` | `2026-12` | Founder decision (2026-10-27): MVP announced for **December 2026** — supersedes Doc 06 / Doc 15 dates |
| `launch.appsLive` | `false` | `true` → store buttons replace the waitlist CTA |
| `stores.appStore` / `stores.playStore` | — | Shown only when `appsLive` is true |
| `legal.companyName` / `legal.rccm` / `legal.address` | `MBOA SAS` / — / — | Doc 16 placeholders — filled by the founder |
| `legal.privacyEmail` / `legal.supportEmail` | — | e.g. `privacy@…`, `support@…` |
| `contact.email` / `contact.whatsapp` / `contact.phone` | — | Filled by the founder |
| `socials.instagram` / `tiktok` / `facebook` / `linkedin` | — | Filled by the founder |
| `waitlist.showCounter` / `waitlist.counterFloor` | `true` / `50` | Public counter shown only above the floor |

- An **empty optional value hides its UI element** (no social icon without a URL, no WhatsApp button without a number).
- An empty legal value renders a visible `[à compléter]` marker and logs a **build warning** — never a silent blank.

---

# Architecture — Mandatory Patterns

## Static First, Islands by Exception

```
.astro component (zero JS)  →  default for everything
        │
        ├── interactivity achievable in HTML/CSS?   → <details>, <dialog>, :target, CSS scroll-snap
        ├── decorative motion?                       → CSS / shared Motion script (see Animations)
        └── client state / network call?             → React island in components/islands/
                                                       hydrated with client:visible (or client:idle)
```

- FAQ accordion = `<details>`, mobile menu = `<dialog>`, carousels = CSS scroll-snap.
- Islands use `client:visible` by default, `client:idle` above the fold, **never `client:load` without justification**.
- Islands receive already-translated strings as props — they never import the i18n dictionaries.
- Only `src/pages/api/*`, the Keystatic admin and the deep-link fallback set `prerender = false`. Everything else is prerendered.

## i18n

- Locales: `fr` (default, `/`) and `en` (`/en/`) — `i18n.defaultLocale = "fr"`, `prefixDefaultLocale: false`.
- **Every visible string** comes from `src/i18n/{fr,en}.json` (UI) or a content collection (long text). No hardcoded copy.
- `fr.json` and `en.json` must always have **identical keys** — enforced by a unit test.
- The language switcher maps the current page to its counterpart via `routes.ts`, never back to home.
- `liveRoutes` in `routes.ts` lists the pages that exist; navigation only links to those. Add a key in the same change that adds its pages (a unit test checks the files exist).
- Every page emits `hreflang` alternates (`fr`, `en`, `x-default`) and a canonical URL.
- EN is adapted, not translated word for word (Doc 06 §4.2). The founder proofreads EN.

## Forms & Lists (Brevo)

```
React island  →  POST /api/<form>  (Astro endpoint on Cloudflare)
                      │ 1. verify Turnstile token (server-side)
                      │ 2. validate payload (Zod — same schema as the client)
                      │ 3. upsert contact in the form's Brevo list (double opt-in when email given)
                      ▼
                    Brevo  ── list: waitlist · pioneers · agents      contact → email to CONTACT_INBOX
```

Fields — **only what is needed** (data minimization, Doc 19 §4):

| Form | Fields |
|------|--------|
| Waitlist | first name · email **or** WhatsApp number (at least one) · city (Douala / Yaoundé / Kribi / Bafoussam / other) · profile (tenant / owner / agency / agent / other) · *optional* "What would make you use Mboa?" (Doc 20 §6) · consent |
| Pioneer providers | first name · last name · WhatsApp · email (optional) · type (owner / agency) · city · number of properties (range) · consent |
| Agents | first name · last name · WhatsApp · email (optional) · city · neighborhoods covered · consent |
| Contact | name · email or WhatsApp · subject · message · consent |

- Phone numbers normalized to E.164 (`+237…` by default).
- Every form shows a consent line linking to the privacy policy; the privacy policy lists every field collected.
- The waitlist counter (`GET /api/waitlist-count`) reads the Brevo list count, is cached 1 h at the edge, and is shown only above `waitlist.counterFloor`.
- Messages follow the warm register (Doc 05 §9.2), in *vous* form.
- Secrets are read from the Cloudflare runtime environment on the server, never exposed to the client.

## Deep Links (app ↔ website)

The domain hosts the files that let shared links open the mobile apps directly.

- `public/.well-known/apple-app-site-association` (served as `application/json` via `_headers`) and `public/.well-known/assetlinks.json`.
- Values needed from the mobile project: Apple Team ID + bundle IDs (`mboa_user`, `mboa_pro`), Android package names + release SHA-256 fingerprints. Never guess them — leave the file absent rather than wrong.
- Link paths (e.g. `/l/annonces/{id}`) are **agreed with the `mobile/` repo** before being declared.
- A fallback page (on-demand route) catches those paths when the app is not installed: brand page + store buttons (or waitlist CTA if `appsLive` is false). Later it may render a public preview from the API (see *Future*).

## Animations

The founder wants **rich animations** — they must stay cheap.

- Page transitions: native cross-document View Transitions (`@view-transition { navigation: auto; }`) — zero JS.
- Scroll reveals: CSS scroll-driven animations (`animation-timeline: view()`) with a static fallback; or `inView` from Motion in the single shared `animations.ts` script.
- Hero / showcase sequences (phone mockups, counters): Motion `animate`, loaded once, ≤ 10 KB gzip.
- Animate only `transform` and `opacity`. No layout-thrashing properties, no animation on LCP image load.
- **`prefers-reduced-motion: reduce` disables every non-essential animation** — tested in e2e.

## SEO & Structured Data

- One `<title>` + `<meta name="description">` per page and locale, from the i18n dictionaries.
- Open Graph image per key page (1200×630, Vert Forêt background, white logo — Doc 06 §2.2 style).
- JSON-LD: `Organization` everywhere, `FAQPage` on the FAQ, `MobileApplication` only once store links exist.
- `@astrojs/sitemap` with i18n alternates; preview URLs (`*.workers.dev`) send `X-Robots-Tag: noindex`.

## Future (not in the first release)

- **Keystatic CMS** for news, FAQ, team, settings — after the waitlist launch.
- **Public listing pages from the API** (`api.mboacm.com`) for search engines — requires a public read endpoint on the API side and on-demand rendering with edge caching. Design it with the `api/` repo when the time comes.

---

# Design System

The website transposes the mobile charter (Doc 05) to the web, **following the layout reference in both style and structure** (section rhythm, stat tiles in the hero, category grids, dark feature sections, carousels, logo grid, news block, full-width photo band, icon features row, rich footer). Tokens are declared once in `src/styles/global.css` under `@theme` — **never a raw hex in a component**.

## Color Tokens (Doc 05 §2)

| Token | HEX | Usage |
|-------|-----|-------|
| `forest` | `#1A5C45` | Brand color — logo, secondary buttons, active nav, brand surfaces |
| `forest-light` | `#2D8A67` | Hover on white |
| `forest-pale` | `#E8F4F0` | Section backgrounds, light badges |
| `forest-dark` | `#0F3829` | Dark brand sections, text on green |
| `coral` | `#E8735A` | Large interactive accents (see *Coral & Contrast*) |
| `coral-light` | `#F5A08C` | Decorative hover accents |
| `coral-pale` | `#FDF0EC` | Soft notices |
| `coral-dark` | `#C4503A` | Primary button background, coral text at normal size |
| `white` / `warm-white` | `#FFFFFF` / `#F9F7F4` | Page / alternate section background |
| `gray-light` | `#F0EFED` | Separators |
| `gray-mid` | `#9CA3AF` | Placeholders, inactive icons — **never body text** |
| `gray-dark` | `#6B7280` | Secondary text |
| `ink` | `#1A1A1A` | Headings, body text |
| `error-text` | `#B91C1C` | Error messages (the charter's `#EF4444` is 3.8:1 on white — borders/icons only) |

## Coral & Contrast (proposal, 2026-10-27 — founder may revise)

Coral `#E8735A` reaches only ≈ 3.4:1 against white (and white on coral) — below WCAG AA (4.5:1) for normal text. Doc 05 §2.4 overstates it. Website rule:

| Element | Treatment | Contrast |
|---------|-----------|----------|
| Primary button (on white / light) | `coral-dark` background, white label | 4.6:1 ✅ |
| Primary button hover / pressed | same color + lift shadow + arrow slide / scale 0.98 — no color shift | — |
| Primary button on `forest` / `forest-dark` sections | white background, `forest` label (coral on forest is forbidden) | 7.9:1 ✅ |
| Coral text on white | `coral` only at large size (≥ 24px, or ≥ 18.66px bold — prices, big links); `coral-dark` otherwise | ✅ |
| Icons, underlines, focus accents, decorative interactive shapes | `coral` | ≥ 3:1 ✅ (non-text) |

`gray-dark` text is only AA on `white` / `warm-white`; on `forest-pale` (4.3:1) use `forest-dark`. Small pills follow the same rule: coral-dark on coral-pale (4.2:1) and gray-dark on gray-light (4.1:1) fail at 12px, so those badges use `ink` text.

Any new color pairing must be checked at WCAG 2.1 AA before use.

## Typography (Doc 05 §3)

- **Plus Jakarta Sans** — display & headings (800 / 700 / 600), `letter-spacing: -0.5px` on display and H1.
- **Inter** — body & UI (600 / 500 / 400).
- Web scale (desktop): Display 56–64px · H1 40–48px · H2 32–36px · H3 22–24px · Body 16–18px — fluid with `clamp()`, falling back to Doc 05 §3.2 sizes on mobile.
- Left-aligned by default; centered only for section intros and CTA banners. Buttons never in ALL CAPS.

## Components & Layout

- Buttons: radius 12px, heights 52 / 44 / 36px, Inter SemiBold. Secondary = forest, Outline = forest border 1.5px (Doc 05 §6.1).
- Cards: white, radius 16px, shadow `0 2px 12px rgba(0,0,0,0.08)`. Badges: pill, Inter Medium 11–12px (Doc 05 §6.4).
- Spacing: multiples of 8px (4px allowed for icon + label). Content max width 1200px, side gutter 20px on mobile.
- Mobile-first: design at 390px, then `md` (768px) and `lg` (1024px+). No horizontal scroll at any width.

## Brand Rules Specific to the Website

- **White and airy, not dark-dominant** (Doc 05 §1.2). The reference's dark sections become `forest-dark` surfaces with the brand texture, at most 2 per page.
- **Where the reference uses red surfaces** (cards, banners, testimonial blocks), Mboa uses `forest` — never a coral block. Coral is for interactive elements only.
- Never coral on forest. Never more than two primary colors on one component.
- **Brand texture** (`BrandPattern`, M monograms): only on forest surfaces, 8 % opacity (≈ 6 % behind text), inline SVG from the logo polygon — never on white, never on a photo (Doc 05 §5.3).
- **No folklore**: African anchoring comes through words and real photos, not ethnic patterns.
- **Photos are not available yet** (shoot planned): use `PhotoPlaceholder` (warm-white / forest-pale surface with a Lucide icon and the intended shot as `alt`) — never generic stock. App visuals come from founder-supplied screenshots in `src/assets/apps/`.
- Logos: official SVGs from the brand kit only (`logotype/`, `icone/`, `monogramme/`, `architecture/mboa-pro-*`). Never redraw, recolor outside the palette or add effects. Clear space = height of the "M"; minimum 80px (logotype) / 32px (icon).

---

# Content Rules

## Brand Voice (Doc 05 §9, Doc 06)

**The website uses *vous*** (founder decision, 2026-10-27) — unlike the apps, which use *tu*.

| Audience / page | Register |
|-----------------|----------|
| Visitors, tenants, apps, FAQ, waitlist | **Warm & close** — direct, human, no jargon — in *vous* form |
| Owners, agencies, agents, investors, about, vision | **Premium & assertive** — leader tone, states rather than justifies |
| Legal pages | Neutral legal register — reproduced from Doc 16, never paraphrased |

- Tagline (confirmed): **"Mboa — Chez toi, autrement." / "Mboa — Home, differently."** — a brand signature, kept verbatim even though body copy uses *vous*.
- Always write **Mboa** (capital M, never ALL CAPS, never lowercase, no article in titles). Products: Mboa, Mboa Pro, the management app (official name TBD), Mboa Coliving, Mboa Séjours (Doc 06 §1.5).
- Banned words — FR: "veuillez", "prière de", "utilisateur", "plateforme" (in user-facing copy), "optimal", "synergies". EN: "kindly", "user", "leverage", "seamless", "ecosystem".

## Public vs Internal Information

| ✅ Publishable | ❌ Never publish (founder decisions 2026-10-27 + internal docs) |
|----------------|---------------------------------------------------|
| Vision, mission, values, manifesto, founder story | **Market figures** (sizes, prices, populations from Doc 02) |
| Problem, needs, target cities and segments (qualitative) | **Competitors** — named or compared, in any form |
| App Mboa, App Mboa Pro features; management app as "coming soon" | **Mboa Admin** |
| Pricing tiers (Doc 08 §2.1) with "subject to change" | Financial projections, capital, burn rate, break-even |
| Roadmap phases + MVP date from settings | Internal KPIs, conversion assumptions, salaries, HR plans |
| Legal pages (Doc 16), placeholders filled via settings | Commission rates under validation (DC-04, DC-05), pending legal topics (DL-xx), COBAC / escrow |
| Pioneer program benefits (Doc 18 §5) | Delegated management commission or mandate terms |

- **Phase 2 (Coliving, Séjours) is a vision** — future tense, on the `/vision` page.
- **The management app (M28) is announced as "coming soon"** — describe the service promise (Doc 01 §6.4), never the commission, legal status or a date.
- **Never invent** testimonials, partner logos, user counts, press quotes or statistics. The reference's testimonial / client-logo sections are replaced by true content: founder & team, the waitlist counter, the pioneer program, the trust mechanisms.
- Store buttons appear only when `launch.appsLive` is true; until then, the primary CTA is the waitlist.

---

# Performance & Accessibility Budget

| Metric | Budget |
|--------|--------|
| Lighthouse (mobile) — Performance / Accessibility / Best Practices / SEO | ≥ 95 / 100 / 100 / 100 |
| LCP (mobile, slow 4G) | < 2.5 s |
| CLS | < 0.05 |
| Client JS per page (gzip) | ≤ 10 KB shared animation script + islands present on the page; home < 60 KB total |
| Home page total weight | < 1 MB |
| Hero image | ≤ 150 KB (AVIF), `fetchpriority="high"`, explicit width/height |

- Fonts: self-hosted, Latin subset, `font-display: swap`, preload only the display weight used above the fold.
- Images: always `<Image>` / `<Picture>` with `widths` + `sizes`; never a raw `<img>` on a local asset.
- Accessibility: WCAG 2.1 AA — landmarks, skip link, visible focus ring (forest), keyboard-navigable menu, translated `alt` text, reduced motion respected.

---

# Environments

| Env | URL | Branch | Usage |
|-----|-----|--------|-------|
| `dev` | `http://localhost:4321` | any | Local development (`npm run dev`) |
| `preview` | Workers preview URL per branch (`*.workers.dev`) | `develop`, `feature/*`, `release/*` | Review before release — `noindex` |
| `production` | `https://mboacm.com` (+ `www` redirected to the apex) | `main` | Public site |

Hosting: Cloudflare Workers, same Cloudflare account as R2. Plain values go in `wrangler.jsonc` `vars`; secrets via `npx wrangler secret put <KEY>`, read with `import { env } from "cloudflare:workers"` (`Astro.locals.runtime` no longer exists). Local secrets in `.dev.vars` (never committed — `.dev.vars.example` documents them):
`PUBLIC_SITE_URL` · `PUBLIC_TURNSTILE_SITE_KEY` · `TURNSTILE_SECRET_KEY` · `BREVO_API_KEY` · `BREVO_LIST_WAITLIST` · `BREVO_LIST_PIONEERS` · `BREVO_LIST_AGENTS` · `CONTACT_INBOX` · `PUBLIC_CF_ANALYTICS_TOKEN` · `KEYSTATIC_GITHUB_CLIENT_ID` · `KEYSTATIC_GITHUB_CLIENT_SECRET` · `KEYSTATIC_SECRET`

Only `PUBLIC_*` variables may be read in client code.

---

# Git Workflow — git-flow

Repository: `https://github.com/Sipoufo/mboa_site`. Same **git-flow** model as `mboa_api`, except the production branch is named `main` (not `master`).

| Branch | Role |
|--------|------|
| `main` | Production. Every merge is a tagged release (`v` prefix, e.g. `v1.0.0`) and deploys to production. Never commit directly. |
| `develop` | Integration branch — deploys to a preview URL. Default working base. |
| `feature/*` | New pages / sections / fixes. From `develop` → back into `develop`. |
| `release/*` | Release preparation. From `develop` → into `main` and `develop`. |
| `hotfix/*` | Urgent production fixes. From `main` → into `main` and `develop`. |

```bash
git flow feature start <name>
git flow feature finish <name>
git flow release start <version>
git flow release finish <version>
git flow hotfix start <version>
git flow hotfix finish <version>
```

**Rules for the assistant:**
- Never commit directly to `main` or `develop` — always a `feature/*` branch.
- Only create branches/commits/pushes when the user asks.

---

# Commands

## Run

```bash
npm install                 # install dependencies
npm run dev                 # dev server → http://localhost:4321
npm run build               # build → dist/ (static pages + Cloudflare worker for on-demand routes)
npm run preview             # serve the build locally in workerd (`--background` to detach; `astro preview stop`)
node scripts/generate-og.mjs # regenerate the default Open Graph image
```

## Quality

```bash
npm run check               # astro check (types + .astro diagnostics)
npm run lint                # ESLint (astro, react, jsx-a11y)
npm run format              # Prettier (astro + tailwind class sorting)
```

## Tests

```bash
npm run test                # Vitest — i18n key parity, routes, settings schema, endpoints
npm run test:e2e            # Playwright — navigation, language switch, forms, reduced motion, axe a11y
npm run lhci                # Lighthouse CI against the local build
```

---

# Project Rules

## 1. Plan Before Coding

- Before any page or section, state: the page(s), the source doc(s) and sections, the components created/reused, whether an island is needed (and why), the FR/EN keys added, and any settings key used.
- Present the plan and **wait for explicit approval** before starting.

## 2. Docs and Founder Decisions Are the Source of Truth

- Read the source doc before writing copy and cite it in the plan (e.g. "Pricing — Doc 08 §2.1").
- When docs contradict each other, or a fact is missing, **ask** — never fill the gap with a plausible invention.
- Check `Mboa_Decisions_A_Finaliser.md` before publishing anything tied to a decision: ⏳ items are not public facts.

## 3. Bilingual by Default

- No page, section or string ships in one language only. FR first, EN adapted.
- Adding a page = FR route + EN route + `routes.ts` entry + both sets of meta tags.

## 4. Performance Is a Feature

- The audience browses on mid-range Android phones over paid mobile data — every kilobyte costs them money.
- Any new dependency, island or animation must justify its weight; check the build output before proposing it.

## 5. Always Test

- Unit tests for every util in `src/i18n/` and `src/lib/`, and for every API endpoint (Brevo and Turnstile mocked).
- E2E smoke test per page (both locales, no console error, axe = 0 violations).
- Every form: success, validation error and server error paths.
- No release without a green Lighthouse CI run on the preview build.

## 6. Autonomous Bug Fixing

- Identify the layer (content, i18n, component, island, endpoint, build config) before fixing.
- Fix, add a regression test where it makes sense, document cause + fix in the commit message.

## 7. Self-Improvement

- After each page, look for: duplicated markup to extract into `ui/`, missing translations, image weight, unused CSS/JS.
- Suggest updates to this file to the developer — never modify it autonomously.

## 8. Skills and Sub-agents

- Use any available skill or sub-agent judged useful (frontend design, accessibility review, UX copy, code review, exploration…) without waiting to be asked.

---

# Prohibitions

- **NEVER** publish a figure, price, date, testimonial, partner or legal clause that is not in the production docs or explicitly given by the founder.
- **NEVER** publish market figures, competitors, Mboa Admin, or internal information (financials, KPIs, pending decisions).
- **NEVER** present Phase 2 (Coliving, Séjours) as available, or give terms/dates for the management app — it is "coming soon".
- **NEVER** hardcode a founder-editable value (dates, legal identifiers, contacts, social links, store links) outside `src/content/settings/site.yaml`.
- **NEVER** hardcode user-visible text in a component — i18n dictionaries or content collections only.
- **NEVER** ship a page in one locale only, or let `fr.json` / `en.json` keys drift.
- **NEVER** use *tu* in website copy (the tagline excepted) — the site uses *vous*.
- **NEVER** use a raw hex color or an off-palette color — Tailwind tokens only.
- **NEVER** use coral on a non-interactive surface, coral on forest, or `coral` text at normal size on white.
- **NEVER** use `client:load` without a written justification.
- **NEVER** animate layout properties or ignore `prefers-reduced-motion`.
- **NEVER** load fonts, scripts or trackers from a third-party CDN (Google Fonts, GA, Meta Pixel…).
- **NEVER** add a cookie-setting tracker without a consent mechanism and a privacy-policy update.
- **NEVER** collect a form field the privacy policy does not mention.
- **NEVER** use a raw `<img>` for a local asset, or a generic stock photo — placeholders until the shoot.
- **NEVER** guess deep-link identifiers (Team ID, fingerprints, paths) — get them from the mobile project.
- **NEVER** commit a secret — Wrangler secrets (production) / `.dev.vars` (local) only.
- **NEVER** redraw, recolor or add effects to the Mboa logo — official brand-kit SVGs only.
- **NEVER** commit directly to `main` or `develop`.
