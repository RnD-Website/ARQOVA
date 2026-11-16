# ARQOVA — Magazine Agency

An interactive magazine-style website for ARQOVA, an independent magazine agency, rebuilt from the scroll choreography of the
*Cover Story* reference: a cover that becomes a physical magazine, swings open on its spine, turns a
page into the editor's letter, then flows into contents, stacked story spreads, a pinned photo
sequence, the agency, and a back-cover pitch card.

Design by [seative.digital](https://seative.digital).

**Stack:** React 18 · TypeScript · Framer Motion · Vite · CSS 3D transforms. No GSAP / Three.js.

## Run

On Windows, double-click **`run-local.bat`**: it installs packages on the first run and starts the
dev server at http://localhost:5173. Or from a terminal:

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run build:single # one self-contained HTML → dist-single/index.html
```

`ARQOVA-preview.html` (in this folder) is a prebuilt single-file version with every photo built in —
double-click to open. Only the fonts load online.

## Structure

```
src/
  App.tsx                    section order
  data/content.ts            all copy, stories, colours and photo choices
  assets/photos/             shoot photos, each as <name>-800.webp (720px) + <name>-1440.webp
  hooks/useViewport.ts       viewport size + media queries
  components/
    MagazineIntro.tsx        01–03 cover → magazine → spine open → page turn → editor's letter
    Contents.tsx             04 hover-reveal contents (cursor-trailing photo, page tint)
    Stories.tsx              05 six sticky, overlapping full-screen spreads
    Sequence.tsx             06 pinned photo sequence + word-by-word quote
    About.tsx                07 agency, principles, projects, editorial team, highlights
    BackCover.tsx            08 back cover + pitch card form (flips on submit)
    Chrome.tsx               fixed header + running page folio (p. 001 → p. 100)
    Photo.tsx / Barcode.tsx  graded responsive image, SVG barcode
  styles.css                 design tokens, layouts, breakpoints (1280 / 1024 / 860 / 767)
```

## Tuning the animation

All intro timing lives in the `T` table at the top of `MagazineIntro.tsx` (fractions of the pinned
section's scroll). Section lengths: intro `640vh` (mobile `560vh`), each story `HOLD + 200vh`
(`Stories.tsx`), sequence `460vh` (`styles.css`).

## Notes

- **Photography:** shoot photos live in `src/assets/photos`. To add one, save it there as
  `<name>-800.webp` and `<name>-1440.webp`, add the name to the `import.meta.glob` list and `LOCAL_W`
  in `content.ts`, then use `'local:<name>'` anywhere a photo is set. Every photo on the site is local.
  A light shared grade + grain keeps everything reading as one shoot.
- **Image sharpness:** each `<Photo>` passes a `sizes` hint that includes the scroll-zoom factor, so
  browsers download a file big enough for the zoomed view. Keep that in mind if you change zooms.
- **Form:** the pitch card is front-end only — connect `onSubmit` in `BackCover.tsx` to your
  form service (Formspree, Netlify Forms, an API route…).
- **Reduced motion:** with `prefers-reduced-motion`, the intro and sequence render as static spreads
  and story transforms are disabled.
- **Deploy:** any static host. Use one with HTTP/3 (Vercel, Netlify, Cloudflare Pages) for the
  delivery requirement.
