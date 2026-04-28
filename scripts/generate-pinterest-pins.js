/**
 * Ethyria Pinterest Pin Generator
 *
 * Reads pinterest/pins.json, screenshots all pending pins via Puppeteer
 * and saves them to pinterest/generated/{id}.png (2000×3000px @ 2x).
 *
 * Usage:
 *   node scripts/generate-pinterest-pins.js
 *   node scripts/generate-pinterest-pins.js --id launch-de-001
 *   node scripts/generate-pinterest-pins.js --all   (regenerate even posted pins)
 *
 * Requirements:
 *   puppeteer must be installed:  npm install puppeteer
 *   (On 192.168.8.104 puppeteer is already installed system-wide)
 */

'use strict';

const path   = require('path');
const fs     = require('fs');
const puppeteer = require('puppeteer');

const ROOT       = path.resolve(__dirname, '..');
const PINS_FILE  = path.join(ROOT, 'pinterest', 'pins.json');
const OUT_DIR    = path.join(ROOT, 'pinterest', 'generated');
const TMPL_DIR   = path.join(ROOT, 'pinterest');

// ── CLI args ────────────────────────────────────────────────────────────────
const args      = process.argv.slice(2);
const onlyId    = args.includes('--id') ? args[args.indexOf('--id') + 1] : null;
const regenerateAll = args.includes('--all');

// ── Ensure output directory ──────────────────────────────────────────────────
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// ── Load pins.json ───────────────────────────────────────────────────────────
const pinsData = JSON.parse(fs.readFileSync(PINS_FILE, 'utf8'));

function selectPins() {
  return pinsData.pins.filter(function (pin) {
    if (onlyId) return pin.id === onlyId;
    if (regenerateAll) return true;
    return pin.status === 'pending';
  });
}

// ── Screenshot one pin ───────────────────────────────────────────────────────
async function screenshotPin(browser, pin) {
  const templatePath = path.join(TMPL_DIR, pin.template);
  const outPath      = path.join(OUT_DIR, pin.id + '.png');

  if (!fs.existsSync(templatePath)) {
    console.error('  ✗ Template not found: ' + pin.template);
    return false;
  }

  // Encode content as base64 JSON → URL hash
  const hashData = btoa(JSON.stringify(pin.content));
  const fileUrl  = 'file://' + templatePath.replace(/\\/g, '/') + '?screenshot=1#' + hashData;

  const page = await browser.newPage();

  try {
    // 2× device pixel ratio → 2000×3000 output for crisp Pinterest quality
    await page.setViewport({ width: 1000, height: 1500, deviceScaleFactor: 2 });

    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Extra wait for font rendering and image decode
    await new Promise(function (resolve) { setTimeout(resolve, 600); });

    // Screenshot only the .pin element, not the whole page body
    const pinEl = await page.$('.pin');
    if (!pinEl) {
      console.error('  ✗ .pin element not found in template');
      return false;
    }

    await pinEl.screenshot({ path: outPath, type: 'png' });

    console.log('  ✓ Saved: pinterest/generated/' + pin.id + '.png');
    return true;
  } catch (err) {
    console.error('  ✗ Error: ' + err.message);
    return false;
  } finally {
    await page.close();
  }
}

// ── Update pins.json ─────────────────────────────────────────────────────────
function savePins() {
  fs.writeFileSync(PINS_FILE, JSON.stringify(pinsData, null, 2), 'utf8');
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async function main() {
  const toProcess = selectPins();

  if (toProcess.length === 0) {
    console.log('No pending pins found. Use --all to regenerate existing pins.');
    return;
  }

  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none'   // sharper font rendering on Linux
    ]
  });

  console.log('Processing ' + toProcess.length + ' pin(s)...\n');

  let success = 0;
  let failed  = 0;

  for (const pin of toProcess) {
    console.log('[' + pin.id + '] ' + pin.lang.toUpperCase() + ' · ' + (pin.pinterest ? pin.pinterest.title.slice(0, 50) : pin.id));

    const ok = await screenshotPin(browser, pin);

    if (ok) {
      // Update status in memory
      const match = pinsData.pins.find(function (p) { return p.id === pin.id; });
      if (match) {
        match.status       = 'generated';
        match.generated_at = new Date().toISOString();
      }
      success++;
    } else {
      failed++;
    }
  }

  await browser.close();

  // Persist updated statuses
  savePins();

  console.log('\n─────────────────────────────────');
  console.log('Done: ' + success + ' generated, ' + failed + ' failed.');
  console.log('Output folder: pinterest/generated/');
  console.log('pins.json updated.');

  if (failed > 0) process.exit(1);
}());
