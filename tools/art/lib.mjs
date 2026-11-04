// Shared helpers for Spiritbound's code-drawn pixel art. Node built-ins only.
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

export const hex = (h, a = 255) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), a];

/** RGBA canvas with nearest-pixel drawing. */
export class Canvas {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.px = new Uint8Array(w * h * 4);
  }
  set(x, y, c) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || !c) return;
    const k = (y * this.w + x) * 4;
    if (c[3] === 255) this.px.set(c, k);
    else if (c[3] > 0) {
      const a = c[3] / 255;
      for (let i = 0; i < 3; i++) this.px[k + i] = Math.round(this.px[k + i] * (1 - a) + c[i] * a);
      this.px[k + 3] = Math.max(this.px[k + 3], c[3]);
    }
  }
  get(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return [0, 0, 0, 0];
    const k = (y * this.w + x) * 4;
    return [...this.px.subarray(k, k + 4)];
  }
  rect(x, y, w, h, c) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, c);
  }
  /** Copies another canvas (or a region of it) onto this one. */
  blit(src, dx, dy, sx = 0, sy = 0, w = src.w, h = src.h, flipX = false) {
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        const c = src.get(flipX ? sx + w - 1 - i : sx + i, sy + j);
        if (c[3]) this.set(dx + i, dy + j, c);
      }
  }
  scaled(n) {
    const out = new Canvas(this.w * n, this.h * n);
    for (let y = 0; y < out.h; y++) for (let x = 0; x < out.w; x++) out.set(x, y, this.get(Math.floor(x / n), Math.floor(y / n)));
    return out;
  }
  save(path) {
    writeFileSync(path, encodePng(this.w, this.h, this.px));
  }
}

/** Parses a grid of single-character pixels using a palette map ('.' = transparent). */
export function grid(rows, palette) {
  const h = rows.length;
  const w = rows[0].length;
  const c = new Canvas(w, h);
  rows.forEach((r, y) => {
    if (r.length !== w) throw new Error(`grid row ${y} is ${r.length} wide, expected ${w}: "${r}"`);
    [...r].forEach((ch, x) => {
      if (ch === '.') return;
      const col = palette[ch];
      if (!col) throw new Error(`no palette entry for '${ch}'`);
      c.set(x, y, col);
    });
  });
  return c;
}

/** Small deterministic PRNG so art regenerates identically. */
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

/** Smooth value noise in [0,1], tileable with the given period. */
export function valueNoise(seed, period) {
  const r = rng(seed);
  const g = Array.from({ length: period * period }, r);
  const at = (x, y) => g[(((y % period) + period) % period) * period + (((x % period) + period) % period)];
  const s = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const fx = s(x - xi), fy = s(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
}

export const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((r) => r.map((v) => (v + 0.5) / 16));

/**
 * Shades a boolean mask like a lit 3D form (light from top-left), picking from
 * a dark→light colour ramp, then adds a dark outline around it.
 */
export function shadeMask(mask, w, h, ramp, outline, { light = [-0.6, -0.8], bias = 0, dither = true } = {}) {
  const c = new Canvas(w, h);
  const inside = (x, y) => x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x];
  // Distance to edge (chamfer), capped, gives a rounded "height".
  const dist = new Float32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!inside(x, y)) continue;
      let d = 6;
      for (let r = 1; r <= 6 && d === 6; r++)
        for (let k = -r; k <= r && d === 6; k++)
          if (!inside(x + k, y - r) || !inside(x + k, y + r) || !inside(x - r, y + k) || !inside(x + r, y + k)) d = r;
      dist[y * w + x] = d;
    }
  const H = (x, y) => (inside(x, y) ? Math.sqrt(dist[y * w + x]) : 0);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!inside(x, y)) continue;
      const nx = H(x - 1, y) - H(x + 1, y);
      const ny = H(x, y - 1) - H(x, y + 1);
      let t = 0.5 + (nx * -light[0] + ny * -light[1]) * 0.35 + bias;
      t += (dist[y * w + x] - 2) * 0.03;
      const v = t * (ramp.length - 1);
      let i = Math.floor(v);
      if (dither && BAYER4[y % 4][x % 4] < v - i) i++;
      c.set(x, y, ramp[Math.max(0, Math.min(ramp.length - 1, i))]);
    }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (!inside(x, y) && (inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1))) c.set(x, y, outline);
  return c;
}

function encodePng(w, h, px) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    Buffer.from(px.buffer, px.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  }
  const table = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (b) => {
    let c = 0xffffffff;
    for (const x of b) c = table[(c ^ x) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
