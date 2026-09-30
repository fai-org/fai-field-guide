// Outlines the hero title in Schmalfette Grotesk and writes the paths into
// index.html between the display:start and display:end markers. The font file
// itself never enters the repo; only the finished vector shapes do.
//
//   npm i --no-save opentype.js
//   node tools/outline-display.mjs /path/to/SchmalfetteGrotesk.otf "A field guide" "to the tribes" "of Silicon Valley"
//
// Each extra argument is one line of the title (2–3 words per line).

import fs from "node:fs";
import opentype from "opentype.js";

const [fontPath, ...lines] = process.argv.slice(2);
if (!fontPath || !lines.length) {
  console.error("usage: node tools/outline-display.mjs <font.otf> <line> [line ...]");
  process.exit(1);
}

const buf = fs.readFileSync(fontPath);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
const SIZE = 100;                       // 1 unit = 1% of the em
const TRACK = 0.018 * SIZE;             // brand tracking, +0.015–0.02em
const LEAD = 0.9 * SIZE;                // baseline to baseline
const CAP = font.tables.os2.sCapHeight / font.unitsPerEm * SIZE;

// opentype.js's toPathData drops separators before zeros ("L25.10"), so serialize here.
const n = v => String(Math.round(v * 10) / 10);
const pathData = cmds => cmds.map(c =>
  c.type === "Z" ? "Z" :
  c.type === "Q" ? `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}` :
  c.type === "C" ? `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}` :
  `${c.type}${n(c.x)} ${n(c.y)}`).join("");

let width = 0;
const paths = lines.map((line, i) => {
  const text = line.toUpperCase();
  const y = CAP + i * LEAD;
  let x = 0, d = "";
  for (const glyph of font.stringToGlyphs(text)) {
    d += pathData(glyph.getPath(x, y, SIZE).commands);
    x += glyph.advanceWidth / font.unitsPerEm * SIZE + TRACK;
  }
  width = Math.max(width, x - TRACK);
  return d;
});
const height = CAP + (lines.length - 1) * LEAD;

const svg = `<svg class="display" viewBox="0 0 ${width.toFixed(1)} ${height.toFixed(1)}" aria-hidden="true" focusable="false"><path fill="currentColor" d="${paths.join("")}"/></svg>`;

const file = new URL("../index.html", import.meta.url);
const html = fs.readFileSync(file, "utf8");
const re = /(<!-- display:start -->)[\s\S]*?(<!-- display:end -->)/;
if (!re.test(html)) { console.error("display markers not found in index.html"); process.exit(1); }
fs.writeFileSync(file, html.replace(re, `$1${svg}$2`));
console.log(`Outlined ${lines.length} lines, ${width.toFixed(0)}×${height.toFixed(0)} units.`);
