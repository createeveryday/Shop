# Create+Everyday — Shopify Theme Audit

**Store:** Create+Everyday (createeveryday.art) · **Live theme:** TwiZzyPrintzStudio
**Base theme:** Shopify **Spotlight v12.0.0** (Online Store 2.0, Dawn family)
**Audit date:** 2026-06-26 · **Status:** read-only audit — *no design changes made.*

> How this was done: the Shopify CLI can't authenticate in this headless environment,
> so the live theme was pulled via the **Shopify Admin API** and mirrored into `theme/`.
> Findings below are from reading that mirror.

---

## 1. What theme is this based on?

It's **Shopify Spotlight, version 12.0.0** (author: Shopify; theme store ID `1891`),
lightly customized. Confirmed from `config/settings_schema.json` → `theme_info`.

Spotlight is a free, **Online Store 2.0** theme built on the same engine as Dawn — which
is why the file structure (`base.css`, `global.js`, `card-product.liquid`, the
`component-*.css` / `section-*.css` naming) looks like Dawn. Spotlight's distinctive trait
is **organic "blob" image masks** (`assets/mask-blobs.css`), a gallery/artist-portfolio feel.

**Customizations layered on top of stock Spotlight:**
- `sections/raw.liquid` — a third-party "RAW Element" section (Pixel Union / "pxs" rich-text) for injecting arbitrary HTML/JS.
- `sections/ss-gallery-1.liquid` — "SS – Gallery #1" from the **Section Store** app (a paid section pack; matching "Section Store Demo" theme is also installed).
- `snippets/yoycol-script.liquid` — **Yoycol** print-on-demand integration (injected in `<head>`, runs on product pages).
- `assets/test.js` — **leftover junk** (a "Harry Potter" HTML demo) loaded site-wide. See Risks.
- App embeds: Hulk Form Builder (active), Disable Right-Click (off), Shopify Inbox chat (off).

## 2. How the homepage is built

The homepage is a standard OS 2.0 JSON template: **`templates/index.json`** defines an
ordered stack of sections, each with its own settings/blocks. There are **18 sections
configured, ~12 active** (the rest disabled but retained). The live order:

| # | Section type | Role on page | State |
|---|---|---|---|
| 1 | `custom-liquid` | Full-bleed **autoplay background video** hero (Shopify CDN mp4) | active |
| 2 | `slideshow` (5 slides) | Hero slideshow | disabled |
| 3 | `raw` | "RAW Element" — **contains a pasted email-template HTML blob** | active |
| 4 | `raw` | second raw block | disabled |
| 5 | `image-banner` (3 blocks) | Banner w/ text + buttons | active |
| 6 | `featured-collection` | Product row | active |
| 7 | `image-banner` (3 blocks) | Banner | disabled |
| 8 | `featured-collection` | Product row | active |
| 9 | `image-with-text` (3 blocks) | Story block | active |
| 10–12 | `featured-collection` ×3 | Product rows | active |
| 13 | `image-with-text` (3 blocks) | Story block | active |
| 14 | `collage` (3 blocks) | Collage | disabled |
| 15 | `featured-product` (7 blocks) | Single product feature | disabled |
| 16 | `newsletter` (3 blocks) | Email signup | disabled |
| 17 | `collection-list` (6 blocks) | Collection grid | active |
| 18 | `multicolumn` (1 block) | Icon/columns | active |

**Net:** a cinematic intent already exists (video hero), but the page is a long, repetitive
stack — one video, an HTML email blob, a banner, then **five featured-collection rows**,
two story blocks, a collection grid, and a column section. It reads as "lots of products"
rather than a curated, high-end narrative.

## 3. Files that control the homepage & product cards

**Homepage content & order**
- `templates/index.json` — the homepage itself (section order, settings, copy, images).
- `layout/theme.liquid` — global `<head>`, font/color CSS variables, script loading, header/footer groups.
- `sections/header.liquid` + `sections/header-group.json` — header/nav.
- `sections/footer.liquid` + `sections/footer-group.json` — footer.

**Sections rendered on the homepage (the liquid behind each row)**
- `sections/custom-liquid.liquid` (video hero), `sections/raw.liquid` (RAW Element)
- `sections/image-banner.liquid`, `sections/image-with-text.liquid`
- `sections/featured-collection.liquid`, `sections/collection-list.liquid`, `sections/multicolumn.liquid`
- (disabled but present) `sections/slideshow.liquid`, `sections/collage.liquid`, `sections/featured-product.liquid`, `sections/newsletter.liquid`

**Product cards**
- `snippets/card-product.liquid` — the card markup (≈stock Spotlight; one stray `block.settings.description` line that does nothing here).
- `snippets/card-collection.liquid` — collection cards.
- `snippets/price.liquid` — price/badge rendering inside cards.
- `assets/component-card.css` — card layout/styling.
- Card look is driven by theme settings (`settings.card_style`, `card_color_scheme`, `card_corner_radius`, etc.) in `config/settings_data.json`.

**CSS that styles the homepage**
- `assets/base.css` (78 KB — global), `assets/section-image-banner.css`, `assets/section-multicolumn.css`,
  `assets/section-collection-list.css`, `assets/component-image-with-text.css`, `assets/component-slider.css`,
  `assets/component-card.css`, `assets/mask-blobs.css` (blob masks).

**JS that runs the homepage**
- `assets/global.js` (43 KB — core web components: sliders, modals, etc.), `assets/animations.js` (scroll reveal),
  `assets/pubsub.js`, `assets/constants.js`. (`assets/test.js` is loaded too — and shouldn't be.)

## 4. Online Store 2.0 support?

**Yes — fully.** Every template is JSON (`templates/*.json`), the theme uses
**sections everywhere**, **blocks**, and **section groups** (`header-group.json`,
`footer-group.json`). This means new custom sections can be dropped into the theme and
added/reordered/configured by you in the **theme editor** with no code — the ideal setup
for the planned redesign.

## 5. Where to add custom sections safely

- **Edit on the unpublished `TwiZzyPrintzStudio — SAFE BUILD` theme**, never on MAIN/live.
  (A SAFE BUILD copy already exists, created today. The Admin API also *blocks* file writes
  to the live theme, which reinforces this workflow.)
- **Add brand-new section files** in `theme/sections/` (e.g. `sections/ce-hero-cinematic.liquid`).
  New sections only appear where you choose to add them, so they cannot affect existing pages
  until you place them.
- **Scope styles/scripts to the section** using its own `{% stylesheet %}` / `{% javascript %}`
  blocks or new dedicated asset files — don't widen `base.css`/`global.js`.
- **Build the new homepage as a new section stack** in the editor on SAFE BUILD; keep the old
  sections disabled (not deleted) so you can roll back instantly.
- Publish only after preview + approval.

## 6. What's needed to feel high-end, cinematic, 3D & automotive

This is a **brand pivot**, not only styling. The current catalog and collections are art/print
themed (stickers, posters, t-moji, wildlife, robots) — there's no automotive content yet. To
land the new direction you'll need, roughly in order:

- **Content/merchandising first:** automotive-oriented collections, product imagery/renders, and
  hero video. Cinematic design with art-sticker products underneath won't read as high-end.
- **Art direction:** lean into the existing dark palette (black + red/orange). Add a refined type
  scale, generous spacing, restrained motion, and large full-bleed media.
- **Cinematic hero:** replace the raw `custom-liquid` video with a purpose-built hero section
  (poster image, autoplay/muted/looped video, gradient scrim, headline, CTA, reduced-motion fallback).
- **3D:** use Shopify's native `model-viewer` (GLB/USDZ) for true 3D product spins; for "3D feel,"
  add parallax/scroll-driven reveals and depth (the theme already ships `animations.js` + model-viewer assets).
- **Premium product cards:** hover states, secondary-image reveal, larger media, subtle shadows.
- **Trim the page:** collapse the five featured-collection rows into 1–2 curated showcases.

> No code changes were made for this. Recommended section list is in the Build Plan below.

---

## Deliverables

### A. Theme structure (simple summary)
Shopify **Spotlight 12.0.0**, Online Store 2.0, vanilla CSS/JS (no build step). Dark theme
(black/white/red-orange), Montserrat type, 1400px page width. Homepage is a modular
`index.json` stack of ~12 active sections led by a video hero, heavy on featured-collection
rows. Two third-party section add-ons (RAW Element, Section Store gallery) and a Yoycol POD
integration are layered on. One leftover junk asset (`test.js`) ships site-wide.

### B. Files recommended to EDIT (on SAFE BUILD)
- `templates/index.json` — rebuild the homepage stack (or do it visually in the editor).
- **New section files** you create, e.g. `sections/ce-hero-cinematic.liquid`, `sections/ce-3d-showcase.liquid`, `sections/ce-vehicle-grid.liquid`.
- **New scoped asset files** you create, e.g. `assets/ce-*.css`, `assets/ce-*.js`.
- `snippets/card-product.liquid` — *only* if premium card changes can't be done via settings (duplicate to `card-product-ce.liquid` if heavy).
- `layout/theme.liquid` — minimal, surgical edits only (e.g. **remove the `test.js` include**).
- Theme settings via the editor (writes `config/settings_data.json`) — colors, fonts, card style.

### C. Files recommended NOT to touch
- `assets/base.css`, `assets/global.js`, `assets/constants.js`, `assets/pubsub.js` — Spotlight core.
- `sections/main-product.liquid`, `sections/main-collection-product-grid.liquid`, `sections/header.liquid`, `sections/footer.liquid` — large core sections; extend via blocks/new sections instead.
- `config/settings_data.json` — auto-generated; edit through the theme editor, not by hand.
- `config/settings_schema.json`, `locales/*` — theme plumbing/translations.
- `sections/ss-gallery-1.liquid`, `sections/raw.liquid` — third-party/app-owned; leave as-is (but remove the *content* you no longer want from the homepage).
- Everything on the **MAIN/live** theme.

### D. Safe build plan
1. **Work on `TwiZzyPrintzStudio — SAFE BUILD`** (unpublished). Confirm it's a current copy of MAIN; if stale, duplicate MAIN again.
2. **Lock in art direction** — palette, type scale, spacing, motion rules — as theme settings + a small `ce-tokens.css`.
3. **Build new sections** as standalone files (hero, 3D showcase, vehicle/collection grid, premium cards, story/spec rows). Each self-contained and editor-configurable.
4. **Assemble a new homepage** on SAFE BUILD by adding the new sections; keep legacy sections **disabled, not deleted**, for rollback.
5. **Clean up:** remove the `test.js` include from `theme.liquid`; replace the RAW email-blob section; consolidate the featured-collection rows.
6. **Preview & QA** — desktop/mobile, Lighthouse/performance, reduced-motion, real product data.
7. **Get approval, then publish** SAFE BUILD deliberately. Re-pull into this repo afterward to keep the mirror in sync.

### E. Recommended homepage section list (target)
1. **Cinematic hero** — full-bleed autoplay/muted/looped video + poster fallback, gradient scrim, headline, primary CTA.
2. **Featured vehicle / 3D showcase** — `model-viewer` GLB spin or large product render with spec callouts.
3. **Curated collection showcase** — one strong featured-collection (premium cards, hover reveal), not five.
4. **Brand story / cinematic image-with-text** — large media, parallax/scroll reveal.
5. **Spec or feature strip** — multicolumn with icons (performance/quality/shipping).
6. **Secondary collection grid** — `collection-list` for browsing categories.
7. **Social proof** — reviews/press/logos (new section).
8. **Newsletter / CTA** — re-enable and restyle the existing `newsletter` section.
9. **Footer** — refine within existing `footer-group`.

### F. Risks before we start
1. **Brand/content gap (biggest).** The store sells art/print products; "automotive, high-end" needs new collections, products, and imagery. Cinematic design over art-sticker inventory won't feel high-end. Align catalog + design.
2. **Live store is visible.** On "Pause and Build", shoppers can still see the storefront. Any change published to MAIN is public immediately — hence SAFE-BUILD-only edits + deliberate publish.
3. **`assets/test.js` ships on every page** (loaded via `script_tag` in `theme.liquid`). It's invalid junk → console errors/dead weight. Remove during cleanup.
4. **`raw` "RAW Element" section** on the homepage contains a pasted **email template** HTML blob and allows arbitrary HTML/JS — fragile and a maintenance/security smell. Replace with a real section.
5. **Theme-editor vs. code drift.** `index.json` and `settings_data.json` are edited by the merchant in the admin. Code changes here can be overwritten by editor saves, and vice-versa. Coordinate, and re-pull after admin edits.
6. **Third-party/app dependencies.** Section Store (`ss-gallery-1`), RAW Element, Yoycol, Hulk Form Builder. Removing app blocks/sections from the layout can break related features — audit before deleting.
7. **Performance budget.** Cinematic video + 3D models add weight. Use posters, lazy-loading, compressed `model-viewer` assets, and `prefers-reduced-motion` fallbacks to protect load time and accessibility.
8. **Spotlight upgrade path.** Heavy edits to core files make future Spotlight updates painful. Favor additive new sections/assets to stay mergeable.
