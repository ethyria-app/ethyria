const fs = require("fs");
const path = require("path");
const { globSync } = require("path");

const symbolsDir = path.join(__dirname, "..", "symbols");

// Collect all HTML files in symbols/ (all languages)
function getAllSymbolFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllSymbolFiles(fullPath));
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function getLangFromPath(filePath) {
  const rel = path.relative(symbolsDir, filePath).replace(/\\/g, "/");
  if (rel.startsWith("en/")) return "en";
  if (rel.startsWith("fr/")) return "fr";
  if (rel.startsWith("es/")) return "es";
  if (rel.startsWith("ru/")) return "ru";
  return "de";
}

const files = getAllSymbolFiles(symbolsDir);
let updatedCount = 0;
let skippedCount = 0;

for (const filePath of files) {
  let html = fs.readFileSync(filePath, "utf-8");
  const lang = getLangFromPath(filePath);
  const ogImageUrl = `https://ethyria.at/assets/og-image-${lang}.png`;
  let changed = false;

  // 1. Add og:image:width and og:image:height after og:image (if not already present)
  if (!html.includes("og:image:width")) {
    // Match the og:image meta tag (multi-line or single-line)
    const ogImagePattern =
      /(property="og:image"\s*\n?\s*content="[^"]*"\s*\n?\s*\/>)/;
    const match = html.match(ogImagePattern);
    if (match) {
      html = html.replace(
        match[0],
        match[0] +
          '\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />',
      );
      changed = true;
    }
  }

  // 2. Add twitter:image after twitter:description (if not already present)
  if (!html.includes("twitter:image")) {
    // Match the twitter:description closing tag
    const twitterDescPattern =
      /(name="twitter:description"\s*\n?\s*content="[^"]*"\s*\n?\s*\/>)/;
    const match = html.match(twitterDescPattern);
    if (match) {
      html = html.replace(
        match[0],
        match[0] +
          `\n    <meta\n      name="twitter:image"\n      content="${ogImageUrl}"\n    />`,
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html, "utf-8");
    updatedCount++;
    console.log(`✅ ${path.relative(symbolsDir, filePath)}`);
  } else {
    skippedCount++;
    console.log(
      `⏭️  ${path.relative(symbolsDir, filePath)} (already has tags)`,
    );
  }
}

console.log(
  `\nDone: ${updatedCount} updated, ${skippedCount} skipped (total: ${files.length})`,
);
