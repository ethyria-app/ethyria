const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Embed Poppins Bold font as base64 for SVG rendering
const poppinsBoldPath = path.join(__dirname, '..', 'fonts', 'poppins_bold.woff2');
const poppinsBoldBase64 = fs.readFileSync(poppinsBoldPath).toString('base64');

const interRegularPath = path.join(__dirname, '..', 'fonts', 'inter_regular.woff2');
const interRegularBase64 = fs.readFileSync(interRegularPath).toString('base64');

const WIDTH = 1200;
const HEIGHT = 630;

// Localized content for each language
const variants = [
  {
    lang: 'de',
    line1: 'Deine Träume.',
    line2: 'Deine Analyse.',
    subline: 'KI-Traumdeutung · Tagebuch · Statistik · Datenexport',
    tagFree: '✓ 100% kostenlos',
    tagAndroid: 'Android'
  },
  {
    lang: 'en',
    line1: 'Your Dreams.',
    line2: 'Your Analysis.',
    subline: 'AI Dream Interpretation · Journal · Statistics · Data Export',
    tagFree: '✓ 100% Free',
    tagAndroid: 'Android'
  },
  {
    lang: 'fr',
    line1: 'Vos Rêves.',
    line2: 'Votre Analyse.',
    subline: 'Interprétation des Rêves par IA · Journal · Statistiques · Export',
    tagFree: '✓ 100% Gratuit',
    tagAndroid: 'Android'
  },
  {
    lang: 'es',
    line1: 'Tus Sueños.',
    line2: 'Tu Análisis.',
    subline: 'Interpretación de Sueños con IA · Diario · Estadísticas · Exportación',
    tagFree: '✓ 100% Gratis',
    tagAndroid: 'Android'
  },
  {
    lang: 'ru',
    line1: 'Ваши Сны.',
    line2: 'Ваш Анализ.',
    subline: 'ИИ-Толкование Снов · Дневник · Статистика · Экспорт',
    tagFree: '✓ 100% Бесплатно',
    tagAndroid: 'Android'
  }
];

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function createSvg(variant) {
  // Layout: logo on the left (composited as image), text block right
  const textX = 480;
  const line1Y = 245;
  const line2Y = 325;
  const sublineY = 400;
  const tagsY = 470;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <style>
      @font-face {
        font-family: 'Poppins';
        src: url('data:font/woff2;base64,${poppinsBoldBase64}') format('woff2');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'Inter';
        src: url('data:font/woff2;base64,${interRegularBase64}') format('woff2');
        font-weight: 400;
        font-style: normal;
      }
    </style>

    <!-- Background gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#100c1f"/>
      <stop offset="50%" stop-color="#07112b"/>
      <stop offset="100%" stop-color="#001a79"/>
    </linearGradient>

    <!-- Cyan-to-purple gradient for accent text -->
    <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#01bfff"/>
      <stop offset="100%" stop-color="#5458fb"/>
    </linearGradient>

    <!-- Bottom line gradient -->
    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="20%" stop-color="#01bfff"/>
      <stop offset="80%" stop-color="#5458fb"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>

    <!-- Radial gradient blobs matching landing page body::after -->
    <radialGradient id="blob1" cx="18%" cy="16%" r="30%" fx="18%" fy="16%">
      <stop offset="0%" stop-color="rgba(49,132,255,0.16)"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <radialGradient id="blob2" cx="82%" cy="22%" r="28%" fx="82%" fy="22%">
      <stop offset="0%" stop-color="rgba(84,88,251,0.12)"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <radialGradient id="blob3" cx="50%" cy="78%" r="26%" fx="50%" fy="78%">
      <stop offset="0%" stop-color="rgba(1,191,255,0.08)"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>

    <!-- Grid pattern -->
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="0.5"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>

  <!-- Ambient blobs -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#blob1)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#blob2)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#blob3)"/>

  <!-- Subtle grid overlay -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <!-- Headline line 1 (white) — larger -->
  <text x="${textX}" y="${line1Y}"
        font-family="Poppins, 'Segoe UI', Arial, sans-serif"
        font-weight="700"
        font-size="72"
        fill="#ffffff">${escapeXml(variant.line1)}</text>

  <!-- Headline line 2 (gradient) — larger -->
  <text x="${textX}" y="${line2Y}"
        font-family="Poppins, 'Segoe UI', Arial, sans-serif"
        font-weight="700"
        font-size="72"
        fill="url(#brandGrad)">${escapeXml(variant.line2)}</text>

  <!-- Subline — larger -->
  <text x="${textX}" y="${sublineY}"
        font-family="Inter, 'Segoe UI', Arial, sans-serif"
        font-weight="400"
        font-size="22"
        fill="rgba(255,255,255,0.50)">${escapeXml(variant.subline)}</text>

  <!-- Tag: free -->
  <rect x="${textX}" y="${tagsY - 26}" width="${variant.tagFree.length * 11 + 40}" height="42" rx="21" ry="21"
        fill="rgba(1,191,255,0.08)" stroke="rgba(1,191,255,0.3)" stroke-width="1"/>
  <text x="${textX + 20}" y="${tagsY + 2}"
        font-family="Inter, 'Segoe UI', Arial, sans-serif"
        font-weight="600"
        font-size="16"
        letter-spacing="0.03em"
        fill="#01bfff">${escapeXml(variant.tagFree)}</text>

  <!-- Tag: Android -->
  <rect x="${textX + variant.tagFree.length * 11 + 58}" y="${tagsY - 26}" width="130" height="42" rx="21" ry="21"
        fill="rgba(84,88,251,0.08)" stroke="rgba(84,88,251,0.3)" stroke-width="1"/>
  <text x="${textX + variant.tagFree.length * 11 + 90}" y="${tagsY + 2}"
        font-family="Inter, 'Segoe UI', Arial, sans-serif"
        font-weight="600"
        font-size="16"
        letter-spacing="0.03em"
        fill="#8b8dff">${escapeXml(variant.tagAndroid)}</text>

  <!-- Bottom gradient line -->
  <rect x="0" y="${HEIGHT - 3}" width="${WIDTH}" height="3" fill="url(#lineGrad)"/>
</svg>`;
}

async function generateOgImages() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  const logoPath = path.join(assetsDir, 'Logo_web.png');

  // Prepare the logo: resize to fit left column (wider infinity symbol)
  const logoWidth = 380;
  const logoHeight = Math.round(logoWidth * (578 / 1024)); // maintain aspect ratio ~214px

  const logoResized = await sharp(logoPath)
    .resize(logoWidth, logoHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  for (const variant of variants) {
    const svgText = createSvg(variant);
    const svgBuffer = Buffer.from(svgText);

    const outputPath = path.join(assetsDir, `og-image-${variant.lang}.png`);

    // Render SVG background + text, then composite logo on top
    await sharp(svgBuffer)
      .resize(WIDTH, HEIGHT)
      .composite([
        {
          input: logoResized,
          top: Math.round((HEIGHT - logoHeight) / 2),  // vertically centered
          left: 50
        }
      ])
      .png({ quality: 95 })
      .toFile(outputPath);

    console.log(`✅ Generated: og-image-${variant.lang}.png`);
  }

  console.log('\nAll 5 OG images generated successfully!');
}

generateOgImages().catch(err => {
  console.error('Error generating OG images:', err);
  process.exit(1);
});
