# KYNORA — Website

Homepage recreation of the reference build (carnilove.ashfall.studio) for **KYNORA — Power your everyday.**
Same layout, section order, scroll choreography and interactions; KYNORA brand, copy, palette and imagery.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in /dist
npm run preview   # serve the build
```

Node 18.17+ (tested on Node 22).

## Stack (matches the reference)

| Reference | KYNORA |
|---|---|
| Astro 4.16.19 | Astro 4.16.19 |
| SolidJS islands | SolidJS (`Header`, `Globe`) |
| GSAP + ScrollTrigger | GSAP 3 + ScrollTrigger + MotionPath |
| Lenis 1.3.4 | Lenis 1.3.4 (lerp 0.1, same as reference) |
| Three.js | Three.js (ambassadors globe) |
| Tailwind CSS | Tailwind CSS 3 |

## Folder structure

```
src/
  pages/index.astro              Homepage — section order lives here
  layouts/BaseLayout.astro       <head>, loader, header island, Lenis + loader boot
  data/content.ts                ALL copy, links, image paths (edit content here)
  styles/global.css              Fluid rem scale, type scale, grid, button, label
  lib/
    scroll.ts                    Lenis ⇄ GSAP ticker ⇄ ScrollTrigger wiring
    reveal.ts                    Label / title / copy reveal animations ([data-reveal])
    split.ts                     Runtime line splitting for body copy
    app.ts                       onReady() — intros fire after the loader leaves
  elements/                      Custom elements = section behaviour (like reference c-*)
    hero.ts                      Sticky hero: parallax layers, hotspots, grass/birds
    scroll-text.ts               Char-by-char statement + sticky photo parallax
    beliefs.ts                   Trail draw, number marker, tilted photos, final expand
  components/
    layout/Header.tsx            Solid island: hide-on-scroll header, mega menus, mobile menu
    layout/Footer.astro          Footer + fitted, scroll-waving wordmark
    sections/hero/               Hero.astro, Grass.astro (procedural), ProductHotspot.astro
    sections/ScrollText.astro
    sections/beliefs/            Beliefs.astro, BeliefSection.astro, trails.ts (path data)
    sections/Ambassadors.astro
    sections/ProductFinderPromo.astro
    globe/                       Globe.tsx (Three.js), landTexture.ts (world map texture)
    ui/                          Label, SplitTitle, Button, Icon, Logo
public/images/                   All images (swap files 1:1 — see docs/IMAGE_PROMPTS.md)
docs/IMAGE_PROMPTS.md            Magnific prompts + exact sizes for every image slot
```

## Section map (reference → KYNORA)

| # | Reference section | Height (desktop) | KYNORA content |
|---|---|---|---|
| 0 | Loader | full screen | KYNORA logo reveal |
| 1 | `c-hero` — sticky, layered parallax, 2 pack hotspots | 215vh | "Trust your strength", creatine + protein tubs on stone |
| 2 | `c-scroll-text` — char reveal + sticky photo | ~2050px | "Guided by science…" + lifestyle photo |
| 3 | `c-beliefs` intro + 3 trail sections | ~4370px | "The formula we follow" · 3 beliefs |
| 4 | `c-ambassadors` — Three.js globe + markers | ~1910px | "Leading the way side by side" · 5 ambassadors |
| 5 | `c-product-finder-promo` | ~660px | "Find your perfect formula" quiz CTA |
| 6 | Footer + giant wordmark | 100vh | "POWER YOUR EVERYDAY." |

## Palette mapping

| Reference role | Reference | KYNORA |
|---|---|---|
| Dark section bg | Purple `#74003D` | Brown `#57382B` |
| Text dark | Deep purple `#4A002A` | Black `#171515` |
| Accent (buttons, dots, final belief bg, wordmark) | Red `#F00037` | Orange `#E66A32` |
| Light bg | Beige `#F6E1CE` | Cream `#F4E9D9` |
| Header / footer bg | Light beige `#FFF3E4` | White `#FFFFFF` |
| Secondary lines | — | Beige `#B58A6C` |

## Fonts

The reference uses commercial fonts (TT Bluescreens, Matter) that can't be redistributed.
Closest open alternatives, self-hosted via Fontsource:

- Headings: **League Gothic** — width per line within ~4% of TT Bluescreens, so titles break on the same lines.
- Body: **Figtree** (variable) — closest open match to Matter.

If you license the originals, add them to `public/fonts`, declare `@font-face` in `global.css`, and change `fontFamily` in `tailwind.config.mjs`.

## Responsive scale

Like the reference, `html` font-size is fluid and all spacing is in tenths of a rem (`pt-120` = 12rem):
mobile 375 design (1rem = 10px @375), tablet 768 design, desktop 1600 design (1rem = 9px @1440).

## Not in this build (homepage-only scope)

Subpages (Mission, Ambassadors, Blog, Contact, product listings), the search overlay, region picker and the 5-step quiz overlay. Links point to `#` until those pages exist.
