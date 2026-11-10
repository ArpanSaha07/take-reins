// Generates the original Take Reins PNG icons with no dependencies.
// Usage: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const outDir = fileURLToPath(new URL('../extension/icons/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const hex = (h, a = 1) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), a];
const TEAL = hex('#0f766e');
const WHITE = hex('#ffffff');
const ORANGE = hex('#e8710a');
const INK = hex('#202124');

const circle = (cx, cy, r) => (x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
const ring = (cx, cy, r, w) => (x, y) => {
  const d = Math.hypot(x - cx, y - cy);
  return d <= r && d >= r - w;
};
const rect = (x0, y0, x1, y1) => (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
const roundRect = (x0, y0, x1, y1, r) => (x, y) => {
  if (!rect(x0, y0, x1, y1)(x, y)) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};

// Layers are painted in order; later layers cover earlier ones.
const brand = [
  [roundRect(0.03, 0.03, 0.97, 0.97, 0.22), TEAL],
  [ring(0.5, 0.5, 0.33, 0.09), WHITE],
  [circle(0.5, 0.5, 0.1), WHITE],
];
const stopwatch = [
  [roundRect(0.4, 0.0, 0.6, 0.14, 0.03), ORANGE],
  [rect(0.46, 0.1, 0.54, 0.2), ORANGE],
  [circle(0.5, 0.58, 0.42), ORANGE],
  [circle(0.5, 0.58, 0.31), WHITE],
  [rect(0.455, 0.33, 0.545, 0.58), INK],
  [circle(0.5, 0.58, 0.07), INK],
];

function render(size, layers) {
  const SS = 4; // supersampling per axis for anti-aliasing
  const px = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let pxl = 0; pxl < size; pxl++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (pxl + (sx + 0.5) / SS) / size;
          const y = (py + (sy + 0.5) / SS) / size;
          let c = null;
          for (const [hit, color] of layers) if (hit(x, y)) c = color;
          if (c) { r += c[0] * c[3]; g += c[1] * c[3]; b += c[2] * c[3]; a += c[3]; }
        }
      }
      const i = (py * size + pxl) * 4;
      if (a > 0) { px[i] = r / a; px[i + 1] = g / a; px[i + 2] = b / a; }
      px[i + 3] = Math.round((a / (SS * SS)) * 255);
    }
  }
  return png(size, px);
}

function crc32(buf) {
  let c = ~0;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const size of [16, 32, 48, 128]) writeFileSync(`${outDir}icon-${size}.png`, render(size, brand));
for (const size of [16, 32]) writeFileSync(`${outDir}stopwatch-${size}.png`, render(size, stopwatch));
console.log(`Icons written to ${outDir}`);
