/**
 * High-Quality Screenshot Conversion for Slider 1
 *
 * Strategy:
 *   - AVIF lossy (quality 90, effort 9) → best gradient rendering, smallest size
 *   - WebP lossless → pixel-perfect, no banding on dark gradients
 *   - JPG originals kept untouched as fallback
 *   - 2x retina variants (920px wide) + 1x (460px wide)
 *
 * Source: JPG files in assets/screenshots_new_1/
 * Output: AVIF + WebP lossless in same directory
 *
 * Naming convention:
 *   analyse_de.avif        (1x, 460px)
 *   analyse_de@2x.avif     (2x, 920px)
 *   analyse_de.lossless.webp       (1x, 460px)
 *   analyse_de@2x.lossless.webp    (2x, 920px)
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "assets", "screenshots_new_1");
const LANGS = ["de", "en", "es", "fr", "ru"];
const SCREENS = ["analyse", "aether", "statistic"];

// Source JPG mapping (original filenames before rename)
const SOURCE_MAP = {
  analyse: "analyse", // analyse_de.jpg exists (copied from analysis_de.jpg)
  aether: "aether", // aether_de.jpg exists
  statistic: "statistic", // statistic_de.jpg exists (copied from dashboard_de.jpg)
};

const WIDTH_1X = 460;
const WIDTH_2X = 920;

async function run() {
  let created = 0;

  for (const screen of SCREENS) {
    for (const lang of LANGS) {
      const srcName = `${SOURCE_MAP[screen]}_${lang}.jpg`;
      const srcPath = path.join(SRC_DIR, srcName);

      if (!fs.existsSync(srcPath)) {
        console.error(`MISSING: ${srcName}`);
        continue;
      }

      const base = `${screen}_${lang}`;
      const pipeline = sharp(srcPath);
      const meta = await pipeline.metadata();
      console.log(`\nProcessing: ${srcName} (${meta.width}x${meta.height})`);

      // --- AVIF 2x (920px) ---
      const avif2x = path.join(SRC_DIR, `${base}@2x.avif`);
      await sharp(srcPath)
        .resize(WIDTH_2X, null, { withoutEnlargement: true })
        .avif({ quality: 90, effort: 9, chromaSubsampling: "4:4:4" })
        .toFile(avif2x);
      console.log(`  AVIF 2x: ${path.basename(avif2x)} (${fsize(avif2x)})`);
      created++;

      // --- AVIF 1x (460px) ---
      const avif1x = path.join(SRC_DIR, `${base}.avif`);
      await sharp(srcPath)
        .resize(WIDTH_1X, null, { withoutEnlargement: true })
        .avif({ quality: 90, effort: 9, chromaSubsampling: "4:4:4" })
        .toFile(avif1x);
      console.log(`  AVIF 1x: ${path.basename(avif1x)} (${fsize(avif1x)})`);
      created++;

      // --- WebP lossless 2x (920px) ---
      const webpll2x = path.join(SRC_DIR, `${base}@2x.lossless.webp`);
      await sharp(srcPath)
        .resize(WIDTH_2X, null, { withoutEnlargement: true })
        .webp({ lossless: true, effort: 6 })
        .toFile(webpll2x);
      console.log(
        `  WebP-LL 2x: ${path.basename(webpll2x)} (${fsize(webpll2x)})`,
      );
      created++;

      // --- WebP lossless 1x (460px) ---
      const webpll1x = path.join(SRC_DIR, `${base}.lossless.webp`);
      await sharp(srcPath)
        .resize(WIDTH_1X, null, { withoutEnlargement: true })
        .webp({ lossless: true, effort: 6 })
        .toFile(webpll1x);
      console.log(
        `  WebP-LL 1x: ${path.basename(webpll1x)} (${fsize(webpll1x)})`,
      );
      created++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Done: ${created} files created.`);
  console.log(`========================================\n`);

  // Verify
  console.log("--- Verification ---");
  let missing = 0;
  for (const screen of SCREENS) {
    for (const lang of LANGS) {
      const base = `${screen}_${lang}`;
      const expected = [
        `${base}.avif`,
        `${base}@2x.avif`,
        `${base}.lossless.webp`,
        `${base}@2x.lossless.webp`,
        `${base}.jpg`,
      ];
      for (const name of expected) {
        const f = path.join(SRC_DIR, name);
        if (!fs.existsSync(f)) {
          console.error(`MISSING: ${name}`);
          missing++;
        }
      }
    }
  }
  if (missing === 0) {
    console.log(
      `All ${SCREENS.length * LANGS.length * 5} expected files present ✓`,
    );
  } else {
    console.error(`${missing} files missing!`);
  }
}

function fsize(filepath) {
  const bytes = fs.statSync(filepath).size;
  if (bytes < 1024) return `${bytes} B`;
  const kb = (bytes / 1024).toFixed(1);
  return `${kb} KB`;
}

run().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
