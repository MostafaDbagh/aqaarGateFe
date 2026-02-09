#!/usr/bin/env node
/**
 * Generate static OG image for WhatsApp/social sharing.
 * Run: node scripts/generate-og-image.js
 * Output: public/images/logo/og-default.png (1200x630, < 300KB for WhatsApp)
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT = path.join(__dirname, '../public/images/logo/og-default.png');

async function generate() {
  const gradientSvg = `
    <svg width="${WIDTH}" height="${HEIGHT}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f1913d"/>
          <stop offset="50%" style="stop-color:#ff6b35"/>
          <stop offset="100%" style="stop-color:#e85a2e"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <rect x="500" y="165" width="200" height="200" rx="24" fill="white" opacity="0.95"/>
      <text x="600" y="310" font-family="Arial, sans-serif" font-size="90" font-weight="900" fill="#f1913d" text-anchor="middle">AG</text>
      <text x="600" y="400" font-family="Arial, sans-serif" font-size="72" font-weight="900" fill="white" text-anchor="middle">AqaarGate</text>
      <text x="600" y="460" font-family="Arial, sans-serif" font-size="36" font-weight="600" fill="white" text-anchor="middle">Real Estate</text>
      <text x="600" y="520" font-family="Arial, sans-serif" font-size="26" fill="white" text-anchor="middle" opacity="0.95">Premium Properties in Syria &amp; Lattakia</text>
      <text x="600" y="600" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" opacity="0.9">www.aqaargate.com</text>
    </svg>
  `;

  const outputDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await sharp(Buffer.from(gradientSvg))
    .resize(WIDTH, HEIGHT)
    .png({ quality: 85, compressionLevel: 9 })
    .toFile(OUTPUT);

  const stat = fs.statSync(OUTPUT);
  console.log(`Generated ${OUTPUT} (${(stat.size / 1024).toFixed(1)} KB)`);
  if (stat.size > 300 * 1024) {
    console.warn('Warning: Image > 300KB. WhatsApp may not show it.');
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
