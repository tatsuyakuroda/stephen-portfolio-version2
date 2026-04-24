/**
 * Crops footertext.png to remove extra white space for a seamless marquee loop.
 * Run: node scripts/crop-footer-image.js
 * Requires: npm install sharp
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, '../public/images/footertext.png');
const outputPath = join(__dirname, '../public/images/footertext-cropped.png');

sharp(inputPath)
  .trim({ threshold: 10 })
  .toFile(outputPath)
  .then(() => console.log('Cropped image saved to public/images/footertext-cropped.png'))
  .catch((err) => console.error('Error:', err.message));
