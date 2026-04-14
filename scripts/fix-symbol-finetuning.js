/**
 * fix-symbol-finetuning.js
 * Fix 3 issues on all 75 symbol detail pages:
 * 1. CSS load order: swap style.css and tailwind.min.css (tailwind first, then style.css overrides)
 * 2. Companion symbol tags: increase padding (px-3 py-1 → px-4 py-2)
 * 3. Variant related links: increase padding (add px-2 py-1 to each link)
 */
const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..", "symbols");
const LANGS = ["", "en", "fr", "es", "ru"];
const SYMBOLS = [
  "auto-unfall",
  "ex-partner",
  "fallen",
  "fliegen",
  "haus-raeume",
  "hunde-katzen",
  "nackt-sein",
  "pruefung",
  "schlangen",
  "schwangerschaft",
  "spinnen",
  "tod",
  "verfolgt-werden",
  "wasser",
  "zaehne-verlieren",
];

let processed = 0,
  skipped = 0;

for (const lang of LANGS) {
  for (const sym of SYMBOLS) {
    const dir = lang ? path.join(BASE, lang) : BASE;
    const fp = path.join(dir, sym + ".html");
    if (!fs.existsSync(fp)) {
      console.log(`SKIP: ${fp}`);
      skipped++;
      continue;
    }

    let html = fs.readFileSync(fp, "utf8");

    // === 1. FIX CSS LOAD ORDER ===
    // style.css before tailwind.min.css → swap so tailwind loads first, style.css overrides
    html = html.replace(
      /<link rel="stylesheet" href="((?:\.\.\/)+)style\.css"\s*\/>\s*\n\s*<link rel="stylesheet" href="((?:\.\.\/)+)assets\/tailwind\.min\.css"\s*\/>/,
      (match, p1, p2) => {
        return `<link rel="stylesheet" href="${p2}assets/tailwind.min.css" />\n    <link rel="stylesheet" href="${p1}style.css" />`;
      },
    );

    // === 2. COMPANION SYMBOL TAGS: more internal spacing ===
    // Current: class="text-xs px-3 py-1 rounded-full" on companion <a> tags
    // Target: px-4 py-2 for more breathing room
    html = html.replace(
      /class="text-xs px-3 py-1 rounded-full transition-colors hover:text-white"/g,
      'class="text-xs px-4 py-2 rounded-full transition-colors hover:text-white"',
    );

    // === 3. VARIANT RELATED LINKS: more spacing ===
    // Current: class="text-[11px] text-cyan-500/70 hover:text-cyan-400 transition-colors"
    // Target: add px-2 py-1 for clickable area and spacing
    html = html.replace(
      /class="text-\[11px\] text-cyan-500\/70 hover:text-cyan-400 transition-colors"/g,
      'class="text-[11px] text-cyan-500/70 hover:text-cyan-400 transition-colors px-2 py-1 rounded-md"',
    );

    // Also the "Verwandt:" / "Related:" label: add some padding
    html = html.replace(
      /class="text-\[11px\] text-gray-500">([^<]*:)<\/span>/g,
      'class="text-[11px] text-gray-500 mr-1">$1</span>',
    );

    fs.writeFileSync(fp, html, "utf8");
    console.log(`OK  ${lang || "de"}/${sym}`);
    processed++;
  }
}

console.log(`\nDone. Processed: ${processed}, Skipped: ${skipped}`);
