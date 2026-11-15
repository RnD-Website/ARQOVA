# ARQOVA — Magazine Agency

An interactive magazine-style website for ARQOVA, an independent magazine agency, rebuilt from the scroll choreography of the
*Cover Story* reference: a cover that becomes a physical magazine, swings open on its spine, turns a
page into the editor's letter, then flows into contents, stacked story spreads, a pinned photo
sequence, the studio, and a back-cover commission card.

**Stack:** React 18 · TypeScript · Framer Motion · Vite · CSS 3D transforms. No GSAP / Three.js.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run build:single # one self-contained HTML → dist-single/index.html
```

`ARQOVA-preview.html` (in this folder) is a prebuilt single-file version — double-click to open.
Photos and fonts load from Unsplash and Google Fonts, so it needs an internet connection.

## Structure

```
src/
  App.tsx                    section order
  data/content.ts            all copy, stories, colours and photo IDs
  hooks/useViewport.ts       viewport size + media queries
  components/
    MagazineIntro.tsx        01–03 cover → magazine → spine open → page turn → editor's letter
    Contents.tsx             04 hover-reveal contents (cursor-trailing photo, page tint)
    Stories.tsx              05 six sticky, overlapping full-screen spreads
    Sequence.tsx             06 pinned photo sequence + word-by-word quote
    About.tsx                07 studio, philosophy, projects, collaborators, highlights
    BackCover.tsx            08 back cover + commission card form (flips on submit)
    Chrome.tsx               fixed header + running page folio (p. 001 → p. 100)
    Photo.tsx / Barcode.tsx  graded responsive image, SVG barcode
  styles.css                 design tokens, layouts, breakpoints (1280 / 1024 / 860 / 767)
```

## Tuning the animation

All intro timing lives in the `T` table at the top of `MagazineIntro.tsx` (fractions of the pinned
section's scroll). Section lengths: intro `640vh` (mobile `560vh`), each story `HOLD + 200vh`
(`Stories.tsx`), sequence `460vh` (`styles.css`).

## Notes

- **Photography:** Unsplash images (free licence) with one shared grade (contrast, desaturation,
  warm tone, film grain) so they read as one shoot. Swap IDs in `content.ts` for commissioned work.
- **Form:** the commission card is front-end only — connect `onSubmit` in `BackCover.tsx` to your
  form service (Formspree, Netlify Forms, an API route…).
- **Reduced motion:** with `prefers-reduced-motion`, the intro and sequence render as static spreads
  and story transforms are disabled.
- **Deploy:** any static host. Use one with HTTP/3 (Vercel, Netlify, Cloudflare Pages) for the
  delivery requirement.
