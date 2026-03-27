# Webmaster Verification Template

Use these snippets when Google Search Console and Bing Webmaster Tools provide verification tokens.

## Google Search Console

```html
<meta name="google-site-verification" content="REPLACE_WITH_GOOGLE_TOKEN" />
```

## Bing Webmaster Tools

```html
<meta name="msvalidate.01" content="REPLACE_WITH_BING_TOKEN" />
```

## Where To Insert

Add both tags to the `<head>` of these live files directly below the existing `robots` meta tag:

- `index.html`
- `index.de.html`
- `index.fr.html`
- `index.es.html`
- `index.ru.html`

## After Insertion

1. Deploy the updated pages.
2. Re-open the verification flow in Google Search Console.
3. Re-open the verification flow in Bing Webmaster Tools.
4. Submit `https://ostyles.github.io/ethyria/sitemap.xml` in both tools.
