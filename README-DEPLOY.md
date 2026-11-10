# SH Builds / Custom Build PCs: GitHub Pages package

Site URL: https://custombuildpcs.github.io/SHbuilds/

## How to deploy
1. Copy everything in this folder into the ROOT of your `SHbuilds` repository (the same level as your current `index.html`).
2. KEEP your existing Google Search Console verification file (`google....html`). This package does not contain, replace or delete it. If GitHub asks about replacing files, only replace `index.html`; the other files here are new.
3. Commit and push. In GitHub: Settings > Pages should serve from your main branch, root folder.
4. In Google Search Console (property `https://custombuildpcs.github.io/SHbuilds/`):
   - Sitemaps > add `sitemap.xml` > Submit.
   - URL Inspection > paste the homepage URL > Request indexing (repeat for /about/, /work/, /services/, /contact/).

## What is in here
- `index.html`, `about/`, `work/`, `services/`, `contact/`: five real pages, each with its own title, description, canonical URL, Open Graph tags and Schema.org data. (The old single-page `#about` style links could not be indexed separately by Google.)
- `sitemap.xml`, `robots.txt`, `404.html`, `.nojekyll`
- `assets/css/style.css`: the same design as before, plus the carousel styles.
- `assets/js/app.js`: menu, gallery filters, project popups, contact form, infinite carousel.
- `assets/js/projects.js`: ALL portfolio data lives here.
- `assets/img/`: optimized WebP photos (4:5), logo, favicons (48px and 192px for Google), social preview image.

## Adding a new build
1. Save the photo as `assets/img/<id>.webp` (4:5 ratio, about 800x1000).
2. Add one line to `assets/js/projects.js`. The homepage carousel, the Our Work gallery, the popup and the ItemList structured data all update automatically.
3. Optional: add the photo to `sitemap.xml` and update the `lastmod` dates.

## Notes
- robots.txt: Google only reads `robots.txt` at the root of a host. For a project site at `/SHbuilds/` it is not read, which is fine: everything is crawlable by default, and the sitemap is submitted in Search Console instead. (If you ever use a custom domain, it will work as written.)
- Structured data intentionally has no street address, opening hours, ratings or reviews because none were provided. Add `address` / `openingHours` to the LocalBusiness block (top of each page, `<script type="application/ld+json">`) if you want them.
- The contact form opens the visitor's email app (mailto). It needs no backend.
