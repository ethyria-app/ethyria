# SEO QA Checklist

Use this checklist before pushing SEO changes and again after deployment.

## Before Push

1. Confirm every live language page still has exactly one canonical URL.
2. Confirm hreflang links are complete across English, German, French, Spanish, Russian, and `x-default`.
3. Confirm `title`, `description`, Open Graph, and Twitter metadata are localized and semantically aligned.
4. Confirm structured data stays truthful and matches visible page content.
5. Confirm FAQ answers in JSON-LD match the visible FAQ section.
6. Confirm no unsupported claims were introduced about privacy, pricing, platform support, or premium features.
7. Confirm `robots.txt` still points to the live sitemap.
8. Confirm `sitemap.xml` still lists all live URLs and has refreshed `lastmod` values when needed.
9. Confirm no archived or duplicate pages are present in the published webroot.
10. Confirm the working tree is clean before the final push.

## After Deployment

1. Open all five live URLs and inspect the page source for localized metadata.
2. Validate all five live URLs in Google Rich Results Test.
3. Validate all five live URLs in Schema Markup Validator.
4. Validate the live `robots.txt` and `sitemap.xml` URLs manually.
5. Check Open Graph and Twitter previews on a live metadata preview tool.
6. Check the pages on mobile for layout regressions caused by SEO content additions.
7. Run Lighthouse or PageSpeed Insights on at least the English and German live pages.
8. Re-submit the sitemap in Google Search Console and Bing Webmaster Tools after significant metadata changes.

## Monitoring

1. Watch index coverage trends.
2. Watch click-through rate changes after title or description edits.
3. Watch search queries by language.
4. Watch for rich result eligibility or FAQ rich result changes.
5. Watch for mobile usability regressions after content expansions.
