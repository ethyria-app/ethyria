/**
 * Fix variant card spacing on all 75 symbol detail pages:
 * 1. Verwandt-div: pb-6 → pb-0 (card pb is enough)
 * 2. Card padding: pt-8 pb-6 → pt-6 pb-5 (more symmetrical)
 * 3. Verwandt separator: mt-3 pt-3 → mt-4 pt-4 (more breathing room)
 * 4. Cards gap: space-y-6 → space-y-4 (tighter)
 */
const fs = require("fs");
const path = require("path");

function walk(dir) {
  const results = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...walk(p));
    else if (e.name.endsWith(".html") && e.name !== "index.html")
      results.push(p);
  }
  return results;
}

const files = walk(path.join(__dirname, "..", "symbols"));
let total = 0;

for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  let changed = false;

  // 1. Variant card padding: px-6 pt-8 pb-6 → px-6 pt-6 pb-5 (only inside Deep Variants section)
  const oldCard = 'class="px-6 pt-8 pb-6 rounded-2xl text-center"';
  const newCard = 'class="px-6 pt-6 pb-5 rounded-2xl text-center"';
  if (html.includes(oldCard)) {
    html = html.split(oldCard).join(newCard);
    changed = true;
  }

  // 2. Verwandt div: mt-3 pt-3 pb-6 → mt-4 pt-4 pb-0
  const oldVerwandt =
    'class="flex flex-wrap gap-3 justify-center mt-3 pt-3 pb-6"';
  const newVerwandt =
    'class="flex flex-wrap gap-3 justify-center mt-4 pt-4 pb-0"';
  if (html.includes(oldVerwandt)) {
    html = html.split(oldVerwandt).join(newVerwandt);
    changed = true;
  }

  // 3. Cards gap: space-y-6 → space-y-4 (only inside Deep Variants, identified by surrounding context)
  // The space-y-6 div is directly after the Häufige Varianten h2
  const oldGap = '<div class="space-y-6">';
  const newGap = '<div class="space-y-4">';
  // Only replace the one inside the variants section (check surrounding context)
  if (html.includes(oldGap)) {
    // Replace only the first occurrence that follows the variants heading
    const variantIdx = html.indexOf("Häufige Varianten");
    if (variantIdx === -1) {
      // Try English/other languages
      const altIdx =
        html.indexOf("Common Variants") !== -1
          ? html.indexOf("Common Variants")
          : html.indexOf("Variantes courantes") !== -1
            ? html.indexOf("Variantes courantes")
            : html.indexOf("Variantes comunes") !== -1
              ? html.indexOf("Variantes comunes")
              : html.indexOf("Частые варианты") !== -1
                ? html.indexOf("Частые варианты")
                : -1;
      if (altIdx !== -1) {
        const gapIdx = html.indexOf(oldGap, altIdx);
        if (gapIdx !== -1 && gapIdx - altIdx < 500) {
          html =
            html.substring(0, gapIdx) +
            newGap +
            html.substring(gapIdx + oldGap.length);
          changed = true;
        }
      }
    } else {
      const gapIdx = html.indexOf(oldGap, variantIdx);
      if (gapIdx !== -1 && gapIdx - variantIdx < 500) {
        html =
          html.substring(0, gapIdx) +
          newGap +
          html.substring(gapIdx + oldGap.length);
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, html, "utf8");
    const rel = path.relative(path.join(__dirname, ".."), file);
    console.log(`  ✓ ${rel}`);
    total++;
  }
}

console.log(`\nDone! ${total}/75 files updated.`);
