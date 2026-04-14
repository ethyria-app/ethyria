/**
 * Fix remaining <a> tags that should be <button onclick="openBetaPopup()">
 * These are malformed: <a\n  class="inline-block...>text</button>
 * The href was already removed but the <a> tag wasn't changed to <button>.
 */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  const results = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...walk(p));
    else if (e.name.endsWith('.html') && e.name !== 'index.html') results.push(p);
  }
  return results;
}

const files = walk(path.join(__dirname, '..', 'symbols'));
let fixed = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');

  // Find malformed pattern: <a\n   (optional blank lines)\n   class="inline-block px-8 py-4...>...text...</button>
  // Strategy: Look for '<a' followed within its tag by 'class="inline-block px-8 py-4' and ending with '</button>'
  // Replace opening <a with <button onclick="openBetaPopup()" and fix closing

  let changed = false;

  // Fix: find <a tags that are followed by </button> (malformed from previous run)
  const lines = html.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '<a') {
      // Look ahead for </button> within 15 lines
      let hasButtonClose = false;
      for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
        if (lines[j].includes('</button>')) {
          hasButtonClose = true;
          break;
        }
      }
      if (hasButtonClose) {
        // This <a> should be a <button>
        lines[i] = lines[i].replace('<a', '<button type="button" onclick="openBetaPopup()"');
        // Remove any empty/blank lines immediately after (leftover from href removal)
        while (i + 1 < lines.length && lines[i + 1].trim() === '') {
          lines.splice(i + 1, 1);
        }
        changed = true;
      }
    }
  }

  // Also fix: <a\n   \n   class="inline-block mt-4...>...text...</button> (biosync inline button)
  // These might also exist — same pattern

  if (changed) {
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    const rel = path.relative(path.join(__dirname, '..'), file);
    console.log(`  ✓ ${rel}`);
    fixed++;
  }
}

console.log(`\nFixed ${fixed} files.`);
