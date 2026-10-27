// Generates the default Open Graph image (1200×630): forest background, faint "M"
// texture, white logotype centered (Doc 06 §2.2 style). Run: node scripts/generate-og.mjs
import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const MONOGRAM = "M0 100L0 28L33 -2L52 60L71 -2L104 28L104 100L84 100L84 20.42L59.61 100L44.39 100L20 20.42L20 100Z";

const logotype = readFileSync("src/assets/brand/mboa-logotype-blanc.svg", "utf8");
const logoPath = [...logotype.matchAll(/ d="([^"]+)"/g)].map((match) => match[1]).join(" ");

const logoWidth = 520;
const logoScale = logoWidth / 356;
const logoHeight = 103.5 * logoScale;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <pattern id="m" width="108" height="108" patternUnits="userSpaceOnUse">
      <path d="${MONOGRAM}" fill="#FFFFFF" transform="translate(14 14) scale(0.3462)"/>
      <path d="${MONOGRAM}" fill="#FFFFFF" transform="translate(68 68) scale(0.3462)"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="#1A5C45"/>
  <rect width="100%" height="100%" fill="url(#m)" opacity="0.08"/>
  <path d="${logoPath}" fill="#FFFFFF" fill-rule="evenodd"
    transform="translate(${(WIDTH - logoWidth) / 2} ${(HEIGHT - logoHeight) / 2 + 2 * logoScale}) scale(${logoScale})"/>
</svg>`;

mkdirSync("public/og", { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile("public/og/mboa-default.png");
console.log("public/og/mboa-default.png");
