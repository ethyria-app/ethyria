/**
 * Convert screenshots_new_1 JPGs to WebP and rename to match existing convention.
 *
 * Mapping:
 *   analysis_[lang].jpg → analyse_[lang].jpg + analyse_[lang].webp
 *   aether_[lang].jpg  → aether_[lang].jpg  + aether_[lang].webp  (no rename needed)
 *   dashboard_[lang].jpg → statistic_[lang].jpg + statistic_[lang].webp
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "assets", "screenshots_new_1");
const LANGS = ["de", "en", "es", "fr", "ru"];

const RENAME_MAP = {
  analysis: "analyse",
  aether: "aether",
  dashboard: "statistic",
};

async function run() {
  let converted = 0;
  let renamed = 0;

  for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
    for (const lang of LANGS) {
      const srcFile = path.join(SRC_DIR, `${oldName}_${lang}.jpg`);

      if (!fs.existsSync(srcFile)) {
        console.error(`MISSING: ${srcFile}`);
        continue;
      }

      // 1. Convert to WebP with new name
      const webpDest = path.join(SRC_DIR, `${newName}_${lang}.webp`);
      await sharp(srcFile).webp({ quality: 95 }).toFile(webpDest);
      console.log(
        `WEBP: ${path.basename(srcFile)} → ${path.basename(webpDest)}`,
      );
      converted++;

      // 2. Rename JPG if name differs
      if (oldName !== newName) {
        const jpgDest = path.join(SRC_DIR, `${newName}_${lang}.jpg`);
        fs.copyFileSync(srcFile, jpgDest);
        console.log(
          `COPY: ${path.basename(srcFile)} → ${path.basename(jpgDest)}`,
        );
        renamed++;
      }
    }
  }

  console.log(
    `\nDone: ${converted} WebP created, ${renamed} JPG renamed/copied.`,
  );

  // Verify all expected files exist
  console.log("\n--- Verification ---");
  let missing = 0;
  for (const name of Object.values(RENAME_MAP)) {
    for (const lang of LANGS) {
      for (const ext of ["jpg", "webp"]) {
        const f = path.join(SRC_DIR, `${name}_${lang}.${ext}`);
        if (!fs.existsSync(f)) {
          console.error(`MISSING: ${path.basename(f)}`);
          missing++;
        }
      }
    }
  }
  if (missing === 0) {
    console.log("All 30 expected files present ✓");
  } else {
    console.error(`${missing} files missing!`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
