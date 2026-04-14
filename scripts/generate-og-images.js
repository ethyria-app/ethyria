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
  // Layout constants
  const textX = 430;
  const brandY = 210;
  const line1Y = 280;
  const line2Y = 345;
  const sublineY = 410;
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

    <!-- Tag free border gradient -->
    <linearGradient id="tagFreeGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(1,191,255,0.4)"/>
      <stop offset="100%" stop-color="rgba(1,191,255,0.2)"/>
    </linearGradient>

    <!-- Tag android border gradient -->
    <linearGradient id="tagAndroidGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(84,88,251,0.4)"/>
      <stop offset="100%" stop-color="rgba(84,88,251,0.2)"/>
    </linearGradient>

    <!-- Icon glow filter -->
    <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur"/>
      <feFlood flood-color="#01bfff" flood-opacity="0.2" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

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

  <!-- Brand text "ETHYRIA" with letter-spacing -->
  <text x="${textX}" y="${brandY}"
        font-family="Poppins, 'Segoe UI', Arial, sans-serif"
        font-weight="700"
        font-size="22"
        letter-spacing="0.35em"
        fill="url(#brandGrad)">E T H Y R I A</text>

  <!-- Headline line 1 (white) -->
  <text x="${textX}" y="${line1Y}"
        font-family="Poppins, 'Segoe UI', Arial, sans-serif"
        font-weight="700"
        font-size="56"
        fill="#ffffff">${escapeXml(variant.line1)}</text>

  <!-- Headline line 2 (gradient) -->
  <text x="${textX}" y="${line2Y}"
        font-family="Poppins, 'Segoe UI', Arial, sans-serif"
        font-weight="700"
        font-size="56"
        fill="url(#brandGrad)">${escapeXml(variant.line2)}</text>

  <!-- Subline -->
  <text x="${textX}" y="${sublineY}"
        font-family="Inter, 'Segoe UI', Arial, sans-serif"
        font-weight="400"
        font-size="18"
        fill="rgba(255,255,255,0.45)">${escapeXml(variant.subline)}</text>

  <!-- Tag: free -->
  <rect x="${textX}" y="${tagsY - 24}" width="${variant.tagFree.length * 10 + 36}" height="38" rx="19" ry="19"
        fill="rgba(1,191,255,0.08)" stroke="rgba(1,191,255,0.3)" stroke-width="1"/>
  <text x="${textX + 18}" y="${tagsY + 1}"
        font-family="Inter, 'Segoe UI', Arial, sans-serif"
        font-weight="600"
        font-size="14"
        letter-spacing="0.03em"
        fill="#01bfff">${escapeXml(variant.tagFree)}</text>

  <!-- Tag: Android -->
  <rect x="${textX + variant.tagFree.length * 10 + 52}" y="${tagsY - 24}" width="120" height="38" rx="19" ry="19"
        fill="rgba(84,88,251,0.08)" stroke="rgba(84,88,251,0.3)" stroke-width="1"/>
  <text x="${textX + variant.tagFree.length * 10 + 84}" y="${tagsY + 1}"
        font-family="Inter, 'Segoe UI', Arial, sans-serif"
        font-weight="600"
        font-size="14"
        letter-spacing="0.03em"
        fill="#8b8dff">${escapeXml(variant.tagAndroid)}</text>

  <!-- Bottom gradient line -->
  <rect x="0" y="${HEIGHT - 3}" width="${WIDTH}" height="3" fill="url(#lineGrad)"/>
</svg>`;
}

async function generateOgImages() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  const iconPath = path.join(assetsDir, 'Ethyria_new_app_icon.png');

  // Prepare the app icon: resize to 200×200 with rounded corners
  const iconSize = 200;
  const iconRoundedMask = Buffer.from(`
    <svg width="${iconSize}" height="${iconSize}">
      <rect width="${iconSize}" height="${iconSize}" rx="40" ry="40" fill="white"/>
    </svg>
  `);

  const iconResized = await sharp(iconPath)
    .resize(iconSize, iconSize, { fit: 'cover' })
    .composite([{
      input: iconRoundedMask,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  for (const variant of variants) {
    const svgText = createSvg(variant);
    const svgBuffer = Buffer.from(svgText);

    const outputPath = path.join(assetsDir, `og-image-${variant.lang}.png`);

    // Render SVG background + text, then composite icon on top
    await sharp(svgBuffer)
      .resize(WIDTH, HEIGHT)
      .composite([
        {
          input: iconResized,
          top: Math.round((HEIGHT - iconSize) / 2),  // vertically centered
          left: 100
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
