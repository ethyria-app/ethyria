/**
 * Fix symbol detail pages:
 * 1. FAQ accordion: replace bottom script with direct onclick handlers
 * 2. Variant card spacing: p-5→p-6, space-y-4→space-y-6, title mb-2→mb-3
 * 3. Verwandt link size: text-[11px] → text-xs (12px)
 * 4. Add missing </html> tag
 */

const fs = require("fs");
const path = require("path");

const SYMBOL_DIR = path.join(__dirname, "..", "symbols");
const LANGS = [
  ["de", ""],
  ["en", "en/"],
  ["fr", "fr/"],
  ["es", "es/"],
  ["ru", "ru/"],
];
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

// Inline onclick: close all, then open clicked if it was closed
const ONCLICK =
  "var e=this.getAttribute('aria-expanded')==='true';" +
  "this.closest('.faq-accordion').querySelectorAll('.faq-question').forEach(function(b){b.setAttribute('aria-expanded','false')});" +
  "if(!e)this.setAttribute('aria-expanded','true')";

let ok = 0,
  skipped = 0;

for (const [lang, sub] of LANGS) {
  for (const sym of SYMBOLS) {
    const file = path.join(SYMBOL_DIR, sub, `${sym}.html`);
    if (!fs.existsSync(file)) {
      console.error(`SKIP: ${sub}${sym}.html (not found)`);
      skipped++;
      continue;
    }

    let html = fs.readFileSync(file, "utf8");

    // --- Fix 1: Add onclick to FAQ question buttons ---
    if (!html.includes('faq-question" onclick=')) {
      html = html.replace(
        /<button class="faq-question" aria-expanded="false"/g,
        `<button class="faq-question" onclick="${ONCLICK}" aria-expanded="false"`,
      );
    }

    // --- Fix 2: Remove the initFaqAccordionSymbol script block ---
    html = html.replace(
      /\s*<script>\s*\(function\s*\(\)\s*\{[\s\S]*?initFaqAccordionSymbol[\s\S]*?\}\)\(\);\s*<\/script>/,
      "",
    );

    // --- Fix 3: Variant card padding p-5 → p-6 ---
    html = html.replace(
      /class="p-5 rounded-2xl text-center"/g,
      'class="p-6 rounded-2xl text-center"',
    );

    // --- Fix 4: Variant section gap space-y-4 → space-y-6 ---
    html = html.replace(/<div class="space-y-4">/g, '<div class="space-y-6">');

    // --- Fix 5: Variant title margin mb-2 → mb-3 ---
    html = html.replace(
      /class="text-lg font-bold text-cyan-300 mb-2"/g,
      'class="text-lg font-bold text-cyan-300 mb-3"',
    );

    // --- Fix 6: Verwandt text size text-[11px] → text-xs ---
    html = html.replace(/text-\[11px\]/g, "text-xs");

    // --- Fix 7: Add </html> if missing ---
    if (!html.includes("</html>")) {
      html = html.replace("</body>", "</body>\n</html>");
    }

    fs.writeFileSync(file, html);
    ok++;
  }
}

console.log(`\nDone: ${ok} OK, ${skipped} skipped`);
