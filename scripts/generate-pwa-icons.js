// Generate PWA icons as simple branded squares
// Run: node scripts/generate-pwa-icons.js

const fs = require('fs');
const path = require('path');

function generateSVG(size, maskable = false) {
  const padding = maskable ? Math.round(size * 0.1) : 0;
  const innerSize = size - padding * 2;
  const fontSize = Math.round(innerSize * 0.35);
  const subFontSize = Math.round(innerSize * 0.1);
  const radius = maskable ? 0 : Math.round(size * 0.15);

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#1e40af"/>
  <text x="${size/2}" y="${size * 0.45}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="${fontSize}" fill="white">TA</text>
  <text x="${size/2}" y="${size * 0.65}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="600" font-size="${subFontSize}" fill="rgba(255,255,255,0.8)">TOOLS</text>
</svg>`;
}

function generateScreenshot(width, height, label) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#f8fafc"/>
  <rect width="${width}" height="${Math.round(height*0.08)}" fill="#1e40af"/>
  <text x="${width/2}" y="${Math.round(height*0.055)}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="${Math.round(height*0.03)}" fill="white">ToolsArena</text>
  <text x="${width/2}" y="${height/2}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="${Math.round(height*0.05)}" fill="#1e40af">300+ Free Online Tools</text>
  <text x="${width/2}" y="${height/2 + Math.round(height*0.06)}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${Math.round(height*0.025)}" fill="#64748b">Privacy-first. No signup. Works offline.</text>
</svg>`;
}

const outDir = path.join(__dirname, '..', 'public', 'icons');

// Icons
const configs = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
];

for (const { name, size, maskable } of configs) {
  const svgName = name.replace('.png', '.svg');
  fs.writeFileSync(path.join(outDir, svgName), generateSVG(size, maskable));
  console.log(`Created ${svgName}`);
}

// Screenshots
fs.writeFileSync(path.join(outDir, 'screenshot-wide.svg'), generateScreenshot(1280, 720, 'Desktop'));
fs.writeFileSync(path.join(outDir, 'screenshot-narrow.svg'), generateScreenshot(390, 844, 'Mobile'));
console.log('Created screenshot SVGs');
console.log('\nNote: Convert SVGs to PNGs using any tool, or update manifest.json to use .svg format');
console.log('For now, renaming to .png since browsers accept SVG icons in manifest');
