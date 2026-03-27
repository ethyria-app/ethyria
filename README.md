# Ethyria Landing Page

Multilingual static landing page for Ethyria, focused on AI dream interpretation, dream journaling, and Android app discovery.

## Live Site

- Production URL: https://ostyles.github.io/ethyria/

## Local Usage

- Open `index.html` in a browser for a local preview.
- Run `npm run dev` to rebuild `assets/tailwind.min.css` while editing styles.
- Run `npm run build` before shipping CSS changes.

## Project Structure

- `index.html` – English default landing page
- `index.de.html` – German landing page
- `index.fr.html` – French landing page
- `index.es.html` – Spanish landing page
- `index.ru.html` – Russian landing page
- `style.css` – shared site styling
- `assets/` – static assets, OG images, scripts, and fonts
- `robots.txt` – crawler directives
- `sitemap.xml` – multilingual sitemap with hreflang alternates
- `old_sites/` – archived legacy landing pages kept out of indexing

## SEO Notes

- Canonical production domain is `https://ostyles.github.io/ethyria/`.
- Every localized page carries its own canonical, hreflang, Open Graph, Twitter, and JSON-LD metadata.
- Archived pages under `old_sites/` are intentionally marked `noindex` and blocked in `robots.txt` to avoid duplicate-content competition.
- When metadata changes are shipped, update `sitemap.xml` `lastmod` values and re-submit the sitemap in search tools.

## Deployment

- This repository is designed for static hosting via GitHub Pages.
- After a push to `main`, verify the live metadata on the production URLs instead of relying only on local file previews.
- After SEO changes, validate with Google Rich Results Test, Google Search Console, Bing Webmaster Tools, and a live social-preview checker.

## Operations

- See `SEO_OPERATIONS.md` for the search indexing, validation, and monitoring workflow.
