// Generates the waitlist share images (1200×630), one per locale:
//   public/og/mboa-liste-attente-fr.png · public/og/mboa-liste-attente-en.png
// Same language as the business card: forest-dark surface, the "M" cropped by the edge
// like a roofline, white logotype. Text comes from src/i18n/{fr,en}.json (waitlist.ogImageText,
// waitlist.heading + waitlist.highlight) — rerun after changing those strings.
// Rendered with Playwright + the installed Google Chrome so the brand fonts are used.
// Run: node scripts/generate-og-waitlist.mjs
import { mkdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";

const MONOGRAM = "M0 100L0 28L33 -2L52 60L71 -2L104 28L104 100L84 100L84 20.42L59.61 100L44.39 100L20 20.42L20 100Z";
const logotype = readFileSync("src/assets/brand/mboa-logotype-blanc.svg", "utf8").replace(/<\?xml[^>]*>/, "");
const font = (file) => `data:font/woff2;base64,${readFileSync(`scripts/og-fonts/${file}`).toString("base64")}`;

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function html(locale) {
  const dict = JSON.parse(readFileSync(`src/i18n/${locale}.json`, "utf8")).waitlist;
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><style>
    @font-face { font-family: Jakarta; font-weight: 800; src: url(${font("jakarta-800.woff2")}) format("woff2"); }
    @font-face { font-family: Inter; font-weight: 500; src: url(${font("inter-500.woff2")}) format("woff2"); }
    * { margin: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; overflow: hidden; background: #0F3829; position: relative; font-family: Inter; }
    .roof { position: absolute; width: 640px; right: -170px; top: 90px; fill: #1A5C45; }
    .text { position: absolute; left: 80px; top: 92px; width: 700px; }
    h1 { font-family: Jakarta; font-weight: 800; font-size: 76px; line-height: 1.04; letter-spacing: -1.5px; color: #fff; }
    p { margin-top: 28px; font-size: 30px; line-height: 1.35; color: #E8F4F0; }
    .logo { position: absolute; left: 80px; bottom: 74px; width: 210px; }
    .logo svg { width: 100%; height: auto; display: block; }
    .logo svg path { fill: #fff; }
  </style></head><body>
    <svg class="roof" viewBox="0 -2 104 102"><path fill-rule="evenodd" d="${MONOGRAM}"/></svg>
    <div class="text">
      <h1>${escape(dict.ogImageText)}</h1>
      <p>${escape(`${dict.heading} ${dict.highlight}`)}</p>
    </div>
    <div class="logo">${logotype}</div>
  </body></html>`;
}

mkdirSync("public/og", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const locale of ["fr", "en"]) {
  await page.setContent(html(locale));
  await page.evaluate("document.fonts.ready");
  const path = `public/og/mboa-liste-attente-${locale}.png`;
  await page.screenshot({ path });
  console.log(path);
}
await browser.close();
