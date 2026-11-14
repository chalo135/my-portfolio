# chalo: Charles Ndirangu's portfolio

Next.js 15, React 19, Tailwind 3.4, TypeScript. Four pages (Home, Work, About, Contact) in English (`/en/`) and Kiswahili (`/sw/`), in the "Workbench" design: a cream desk with real things on it.

```
npm install
npm run dev            # http://localhost:3000/en/
npm run build          # production build
npm start              # serve the build at http://localhost:3000
npm run check:links    # checks every page and link (needs npm start running)
```

- Copy lives in `src/content/` (`*.en.ts`, `*.sw.ts`). Kiswahili drafts to review: `SWAHILI_COPY_REVIEW.md`.
- Shared desk pieces (Pill, Paper, Tape, StickyNote, HandNote, BenchObject, drawings): `src/components/bench/`.
- Colours and fonts: `src/app/globals.css` and `tailwind.config.ts`.
- Hosting: Vercel. Every push to `main` deploys. Steps: `DEPLOY.md`. Redirects for old URLs and security headers: `next.config.ts`.
- Page titles, descriptions and share-card tags: `src/lib/page-meta.ts`. Search-engine data (JSON-LD): `src/app/[locale]/layout.tsx`.
- Icons: `src/app/icon.svg` is the drawing. After changing it, copy the change into `scripts/make-icons.mjs` and run `node scripts/make-icons.mjs` to rewrite `src/app/apple-icon.png` and `src/app/favicon.ico`.

## Files you add yourself

| File | What it does |
|---|---|
| `public/me/chalo.jpg` | Your photo, on the Home ID card and the About print (under 500 KB). Without it, both show a `C`. |
| `public/cv/charles-ndirangu-cv.pdf` | Shows the "Download my CV" button on About. |
| `public/work/<slug>.webp` or `.jpg` | A 1600×800 screenshot for each project (under 400 KB). Slugs: `salio`, `pharimz`, `jade-wears`, `kahawa-smart`, `car-moto`, `agrofert`. Without one, the print shows a colour panel. |
| `public/bench/<name>.webp` | A cut-out photo (transparent background, about 800px, under 150 KB) to replace a desk drawing. Names: `notebook`, `phone`, `mug`, `pencil`, `wrench`, `leaf`, `laptop`, `sprocket`, `pen`. |

All of these are picked up at build time. Rebuild after adding one.

To add a live link to a project, set `url` for it in `src/content/work.ts`.
