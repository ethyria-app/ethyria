# SEO Operations

This file documents the recurring operational work required to turn the landing page SEO setup into sustained search visibility.

## Canonical Setup

- Production domain: `https://ostyles.github.io/ethyria/`
- Default English page canonical: `https://ostyles.github.io/ethyria/`
- Localized canonicals:
  - `https://ostyles.github.io/ethyria/index.de.html`
  - `https://ostyles.github.io/ethyria/index.fr.html`
  - `https://ostyles.github.io/ethyria/index.es.html`
  - `https://ostyles.github.io/ethyria/index.ru.html`

## Search Console Workflow

1. Add the GitHub Pages URL property in Google Search Console.
2. Verify ownership using the method you choose for GitHub Pages.
3. Submit `https://ostyles.github.io/ethyria/sitemap.xml`.
4. Request indexing for:
   - root English page
   - German page
   - French page
   - Spanish page
   - Russian page
5. Monitor:
   - coverage
   - alternate page with proper canonical tag
   - mobile usability
   - Core Web Vitals
   - rich result eligibility

## Bing Webmaster Workflow

1. Add the same production property in Bing Webmaster Tools.
2. Import the property from Google Search Console if available.
3. Submit the same sitemap URL.
4. Review crawl information and keyword discovery regularly.

## Validation Checklist After SEO Changes

1. Validate each live page in Google Rich Results Test.
2. Validate each live page in Schema Markup Validator.
3. Confirm localized `title`, `description`, canonical, hreflang, Open Graph, and Twitter tags on all language pages.
4. Confirm `robots.txt` still points to the live sitemap.
5. Confirm `sitemap.xml` includes all live language URLs and fresh `lastmod` values.
6. Confirm `old_sites/` remains blocked and `noindex`.

## Content Governance

- Do not add unsupported claims to metadata or schema.
- Keep all language variants semantically aligned.
- If the Google Play URL goes live, add it to metadata and structured data immediately.
- If the site moves to a custom domain, migrate canonical, hreflang, sitemap, robots, OG image URLs, and Search Console properties together.

## Ranking Focus

- Primary category themes:
  - AI dream interpretation
  - dream journal app
  - Jung and Freud dream analysis
  - private dream diary
  - Android dream analysis app
- Expand content only after metadata, schema, sitemap, and indexing workflow stay stable.