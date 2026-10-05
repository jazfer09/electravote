import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="#0F172A" />
  <rect x="32" y="32" width="448" height="448" rx="96" fill="url(#grad)" fill-opacity="0.15" stroke="#38BDF8" stroke-width="6" stroke-opacity="0.3" />
  <!-- Ballot Box & Checkmark -->
  <path d="M128 200 L384 200 L352 416 L160 416 Z" fill="#1E293B" stroke="#60A5FA" stroke-width="14" stroke-linejoin="round" />
  <path d="M180 200 L180 130 C180 110 200 96 220 96 L292 96 C312 96 332 110 332 130 L332 200" fill="none" stroke="#93C5FD" stroke-width="14" stroke-linecap="round" />
  <!-- Ballot Slot -->
  <rect x="192" y="240" width="128" height="16" rx="8" fill="#0284C7" />
  <!-- Checkmark -->
  <path d="M216 310 L246 340 L306 270" fill="none" stroke="#22C55E" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');

// Function to generate a solid RGBA PNG with a simple centered box or logo representation
function createPng(width, height, r, g, b, a = 255) {
  // Minimal PNG generator using zlib
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type 6: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with filter type 0 at each scanline
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Blue democratic theme with a stylized shield/inner card
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isInner = dist < (width * 0.38);
      const isBorder = dist >= (width * 0.38) && dist < (width * 0.42);

      if (isInner) {
        rawData[pxOffset] = 37;      // R: Blue-600
        rawData[pxOffset + 1] = 99;  // G
        rawData[pxOffset + 2] = 235; // B
        rawData[pxOffset + 3] = 255; // A
      } else if (isBorder) {
        rawData[pxOffset] = 56;      // R: Sky-400
        rawData[pxOffset + 1] = 189; // G
        rawData[pxOffset + 2] = 248; // B
        rawData[pxOffset + 3] = 255; // A
      } else {
        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = a;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcData);

  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

// CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }

  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ 0xffffffff;
}

// Generate PNG icons (dark slate base #0f172a = 15, 23, 42)
const png192 = createPng(192, 192, 15, 23, 42, 255);
const png512 = createPng(512, 512, 15, 23, 42, 255);
const png180 = createPng(180, 180, 15, 23, 42, 255);

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png180);

console.log('PWA icons generated successfully in /public');
