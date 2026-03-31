# Project Status Report — 2026-03-30

## 1. Current Snapshot

- Repository: `C:\Ethyria_LandingPage`
- Project type: multilingual static landing page for Ethyria
- Current branch: `main`
- Current HEAD: `ee10b54` — `Promote test pages to production, archive old pages`
- Working tree status: clean
- Production URL: `https://ostyles.github.io/ethyria/`

## 2. Important Decision History

- A separate performance experiment worktree and branch existed temporarily and was discarded.
- Do not continue any performance-optimization branch unless the user explicitly asks to restart that work.
- In a new session, treat `main` as the only valid working baseline.
- On 2026-03-30 a completely rewritten set of pages (originally built as test pages in `test/`) was promoted to production, replacing the previous pages.
- The previous production pages were archived to `old_sites/`.
- There are no more test pages — every page in root is a production page.

## 3. Product Scope

This repo contains a static marketing / discovery site for Ethyria, focused on:

- AI dream interpretation
- private dream journaling
- psychology-based dream analysis
- Android app discovery and beta signup

Supported locales:

- English: `index.html`
- German: `index.de.html`
- French: `index.fr.html`
- Spanish: `index.es.html`
- Russian: `index.ru.html`

## 4. Architecture

### Frontend

- Static HTML pages per locale
- Shared styling in `style.css`
- Tailwind utility bundle generated into `assets/tailwind.min.css`
- Small shared JavaScript helpers in `assets/`

### Active frontend scripts

- `assets/beta-signup.js`
  - handles the beta email signup form
  - reads `window.ethyriaBetaConfig`
  - posts to the Google Apps Script endpoint
  - shows inline status and toast feedback
- `assets/section-nav.js`
  - injects floating section navigation (up / down buttons)
  - localizes button labels by page language (DE / EN / FR / ES / RU)
  - scrolls between major landing-page sections
  - first anchor is `#top` (flag bar), then `#hero` and subsequent sections

### Backend / external service

- `google-apps-script/Code.gs`
  - Google Apps Script webhook for beta signups
  - stores signups in Google Sheets
  - deduplicates by email
  - sends localized welcome emails
  - download URL currently points to `https://ostyles.github.io/ethyria/assets/ethyria_beta.apk`

## 5. Build / Local Workflow

### Local preview

- Open any locale HTML file directly in the browser
- The user most recently opened `index.de.html` from `main`

### NPM scripts

- `npm run dev`
  - runs Tailwind CLI in watch mode
  - input: `input.css`
  - output: `assets/tailwind.min.css`
- `npm run build`
  - rebuilds and minifies `assets/tailwind.min.css`
- `npm test`
  - placeholder only, not a real test suite

### Practical editing rule

- If you only change `style.css`, no Tailwind rebuild is required.
- If you change `input.css`, rebuild `assets/tailwind.min.css` before shipping.

## 6. Key Files And Their Roles

### Core site files

- `index.html` - English default page
- `index.de.html` - German page
- `index.fr.html` - French page
- `index.es.html` - Spanish page
- `index.ru.html` - Russian page
- `style.css` - shared styling across all locales (promoted from the former test build on 2026-03-30)
- `input.css` - Tailwind input source

### Assets / scripts

- `assets/tailwind.min.css` - generated Tailwind bundle
- `assets/beta-signup.js` - beta signup UX and POST flow
- `assets/section-nav.js` - floating section nav
- `assets/faq-schema-en.json` - JSON data asset for FAQ-related content
- `assets/social-media-snippets.txt` - social promo snippets

### SEO / ops docs

- `README.md` - repo overview and baseline workflow
- `SEO_OPERATIONS.md` - indexing, verification, validation workflow
- `SEO_QA_CHECKLIST.md` - pre-push and post-deploy SEO checks
- `SEO_KEYWORD_MAP.md` - multilingual keyword targeting and content mapping
- `OFFPAGE_AUTHORITY_PLAN.md` - backlink / authority-building plan
- `WEBMASTER_VERIFICATION_TEMPLATE.md` - Google and Bing verification meta templates

### Crawl / discoverability files

- `robots.txt`
  - allows crawling
  - disallows `/google-apps-script/`
  - points to the live sitemap
- `sitemap.xml`
  - includes all 5 locale URLs
  - includes hreflang alternates and `x-default`
  - current `lastmod` values are `2026-03-27`

### Secondary / reference material

- `market_launch.txt`
  - brainstorming transcript / external ideation notes
  - not the primary source of truth for implementation decisions
- `og-template.html`
  - OG / social preview helper template
- `old_sites/`
  - archive of the pre-2026-03-30 production pages (5 HTML + style.css)
  - kept for reference only, not served in production

## 7. SEO Status

### Canonical setup

- Canonical production domain is `https://ostyles.github.io/ethyria/`
- Each locale has its own live URL and is expected to keep aligned metadata

### Current SEO foundation

- multilingual landing pages exist for EN / DE / FR / ES / RU
- sitemap exists and includes hreflang alternates
- robots file points to sitemap
- README and SEO docs are aligned around the GitHub Pages deployment target

### Important operational note

When metadata or page-SEO changes are made in future work:

1. update the relevant localized HTML files
2. update `sitemap.xml` `lastmod`
3. validate live pages after deploy
4. re-submit sitemap in Search Console / Bing Webmaster Tools when relevant

## 8. Beta Signup System Status

### Frontend status

- The landing pages use a per-page `window.ethyriaBetaConfig` object.
- `assets/beta-signup.js` consumes that config.
- The flow supports success, already-registered, saved-without-email, invalid-email, and generic-error states.

### Backend status

- Apps Script stores leads in a Google Sheet named `beta_signups`.
- Duplicate email signups are detected.
- Welcome emails are localized.
- If mail sending fails, the signup is still saved with status `saved_no_email`.

### Dependency note

- Future changes to signup behavior may require edits in both:
  - page-level config inside the locale HTML files
  - `assets/beta-signup.js`
  - `google-apps-script/Code.gs`

## 9. Deployment Status

- Deployment target is GitHub Pages from `main`.
- Current repo state indicates `main` is the authoritative deploy branch.
- No active release branch or experiment branch exists.

## 10. Known Constraints

- No formal automated test suite is present.
- This project depends heavily on manual browser verification.
- Locale pages must remain semantically aligned when copy or metadata changes are made.
- Search / webmaster verification tokens are template-driven and may still need insertion if not already deployed live.

## 11. Recommended Starting Points For The Next Session

Use this order of operations depending on the next task:

### If the task is visual / copy work

1. start from `main`
2. edit the relevant locale HTML files
3. keep all locale claims aligned where the product meaning must stay consistent
4. preview the changed locale locally in a browser

### If the task is shared styling

1. edit `style.css`
2. only rebuild Tailwind if `input.css` changes
3. verify at least DE and EN locally after layout changes

### If the task is SEO

1. use `SEO_KEYWORD_MAP.md` as the targeting source of truth
2. use `SEO_QA_CHECKLIST.md` before and after deploy
3. update `sitemap.xml` if URLs or metadata timestamps need refreshing
4. validate live output, not just local files

### If the task is beta / lead capture

1. check locale HTML config
2. check `assets/beta-signup.js`
3. check `google-apps-script/Code.gs`
4. confirm sheet + mail behavior if flow changes

## 12. What Not To Assume In The Next Session

- Do not assume the performance optimization branch still exists.
- Do not assume uncommitted local work is waiting.
- Do not assume `market_launch.txt` is the implementation plan; it is ideation material.
- Do not assume `npm test` provides coverage.

## 13. Recent Change Log (2026-03-28 → 2026-03-30)

| Commit    | Summary                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------- |
| `44d482e` | DE test page created with full audit fixes, Insight-Pfad content, gradient headlines                  |
| `7703f01` | RU test page added with full translation                                                              |
| `c547640` | EN test page: removed remaining DE leftovers                                                          |
| `767b842` | All test pages: translated remaining theory card labels, module bodies (EN/FR/ES/RU)                  |
| `4c38019` | UI polish across all pages: logo spacing, float-nav top anchor, Spiritual/BMA footer text, flag links |
| `ee10b54` | **Promoted test pages to production**, archived old pages to `old_sites/`, removed test folder        |

## 14. Suggested Next Logical Work Areas

These are not pending requirements, only the most likely future workstreams:

- live SEO validation on the new production pages
- webmaster verification token insertion when available
- Google Play / launch collateral refinement
- multilingual content expansion based on `SEO_KEYWORD_MAP.md`
- off-page authority execution once on-page state is considered stable
- update `sitemap.xml` lastmod dates to reflect the 2026-03-30 page refresh

## 15. One-Line Handoff Summary

The project is a finalized multilingual Ethyria landing page on `main` (5 locales), with completely rewritten pages promoted to production on 2026-03-30; old pages are archived in `old_sites/`; work continues from `main` only.
