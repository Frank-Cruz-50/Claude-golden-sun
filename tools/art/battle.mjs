// Battle art: forest background, Old Bristleback enemy, UI windows.
import { Canvas, hex, rng, shadeMask, valueNoise, BAYER4 } from './lib.mjs';
import { outline } from './tiles.mjs';

export function forestBackground(w = 240, h = 112) {
  const c = new Canvas(w, h);
  const sky = ['#3a6ad0', '#5a8ae0', '#80aaf0', '#a8ccf8', '#d0e8ff'].map((x) => hex(x));
  for (let y = 0; y < 52; y++)
    for (let x = 0; x < w; x++) {
      const v = (y / 52) * (sky.length - 1);
      const i = Math.floor(v) + (BAYER4[y % 4][x % 4] < v - Math.floor(v) ? 1 : 0);
      c.set(x, y, sky[Math.min(i, sky.length - 1)]);
    }
  // clouds
  const cloud = [hex('#a8c0e8'), hex('#d8e8ff'), hex('#ffffff')];
  for (const [cx, cy, rx, ry] of [[40, 14, 22, 6], [62, 11, 14, 5], [170, 20, 26, 6], [200, 16, 14, 5]]) {
    for (let y = cy - ry; y <= cy + ry; y++)
      for (let x = cx - rx; x <= cx + rx; x++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
        if (d > 1) continue;
        const t = 1 - (y - (cy - ry)) / (2 * ry) + (BAYER4[y % 4][x % 4] - 0.5) * 0.5;
        c.set(x, y, cloud[Math.max(0, Math.min(2, Math.floor(t * 3)))]);
      }
  }
  // distant mountains
  const n = valueNoise(17, 16);
  const m = [hex('#5a6aa8'), hex('#7484c0'), hex('#8e9ed4')];
  for (let x = 0; x < w; x++) {
    const top = 22 + Math.floor(n(x / 18, 0) * 22 + n(x / 6, 3) * 6);
    for (let y = top; y < 60; y++) {
      const slope = n((x + 1) / 18, 0) - n((x - 1) / 18, 0);
      const lit = slope < 0 ? 2 : 1;
      c.set(x, y, y - top < 2 ? m[2] : m[lit - (y > 48 ? 1 : 0)]);
    }
  }
  // treeline: rounded crowns with highlight edges
  const t = [hex('#1a3a1a'), hex('#24561c'), hex('#347a24'), hex('#4a9a2e')];
  const r = rng(9);
  for (let i = 0; i < 26; i++) {
    const cx = i * 10 - 4 + Math.floor(r() * 6), cy = 50 + Math.floor(r() * 6), rad = 7 + Math.floor(r() * 4);
    for (let y = cy - rad; y < 72; y++)
      for (let x = cx - rad; x <= cx + rad; x++) {
        const dy = Math.min(0, y - cy);
        if ((x - cx) ** 2 + dy * dy > rad * rad) continue;
        const l = (-(x - cx) - dy) / rad / 2 + 0.3 + (BAYER4[y % 4][((x % 4) + 4) % 4] - 0.5) * 0.4 - (y - cy) / 30;
        c.set(x, y, t[Math.max(0, Math.min(3, Math.floor(l * 3)))]);
      }
  }
  // ground: perspective bands, lighter toward the viewer
  const g = [hex('#2e6a22'), hex('#3a8228'), hex('#4a9a2e'), hex('#62b23a'), hex('#80c848')];
  const gn = valueNoise(3, 8);
  for (let y = 66; y < h; y++)
    for (let x = 0; x < w; x++) {
      const depth = (y - 66) / (h - 66);
      const v = depth * 2.6 + gn(x / (6 + depth * 20), y / 3) * 1.2 + (BAYER4[y % 4][x % 4] - 0.5) * 0.6;
      c.set(x, y, g[Math.max(0, Math.min(4, Math.floor(v)))]);
    }
  const tr = rng(4);
  for (let i = 0; i < 70; i++) {
    const y = 70 + Math.floor(tr() * (h - 72)), x = Math.floor(tr() * w), s = y > 92 ? 2 : 1;
    for (let k = 0; k < s + 1; k++) c.set(x, y - k, g[4]), c.set(x + 1, y - k + 1, g[3]);
    c.set(x - 1, y + 1, g[0]);
  }
  return c;
}

/** Old Bristleback: a huge maddened boar, facing right. 64x44. */
export function bristleback() {
  const W = 64, H = 44;
  const mask = new Array(W * H).fill(false);
  const ell = (cx, cy, rx, ry) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) mask[y * W + x] = true;
  };
  const box = (x0, y0, x1, y1) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) mask[y * W + x] = true;
  };
  ell(28, 22, 21, 13); // body
  ell(47, 23, 11, 10); // head
  ell(56, 28, 5, 4); // snout
  ell(41, 13, 4, 5); // ear
  box(13, 30, 18, 40); box(22, 31, 26, 41); box(36, 31, 40, 41); box(44, 30, 48, 40); // legs
  const ramp = ['#2e1c12', '#4a2e1c', '#6a4428', '#8e6038', '#b8844e'].map((x) => hex(x));
  const c = shadeMask(mask, W, H, ramp, hex('#140c08'), { bias: 0.05 });
  // dark mane along the spine with bristle spikes
  const mane = hex('#22140c'), maneHi = hex('#4a3020');
  for (let x = 8; x < 44; x++) {
    const top = Math.round(22 - Math.sqrt(Math.max(0, 1 - ((x - 28) / 21) ** 2)) * 13);
    const len = 2 + ((x * 7) % 3);
    for (let k = -len; k < 3; k++) c.set(x, top + k, k === -len ? hex('#140c08') : k < 0 && x % 2 ? maneHi : mane);
  }
  // hooves, snout tip, eye, tusks
  for (const [x0] of [[13], [22], [36], [44]]) for (let x = x0; x < x0 + 5; x++) c.set(x, 40 + (x0 === 22 || x0 === 36 ? 1 : 0), hex('#1a1414'));
  for (const [x, y] of [[59, 27], [59, 29], [60, 28]]) c.set(x, y, hex('#3a2018'));
  c.set(50, 19, hex('#ff3020')); c.set(51, 19, hex('#ffe0a0')); c.set(50, 20, hex('#801010'));
  for (const [x, y] of [[53, 31], [54, 30], [55, 29], [55, 28], [56, 27]]) c.set(x, y, hex('#f8f0d8'));
  for (const [x, y] of [[53, 32], [54, 31]]) c.set(x, y, hex('#a89878'));
  return c;
}

/** Classic blue gradient window with a light bevelled border. */
export function drawWindow(c, x, y, w, h) {
  const fill = ['#4a5ad0', '#3a48b0', '#2c3890', '#202a70'].map((v) => hex(v));
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const v = (j / h) * (fill.length - 1);
      const k = Math.floor(v) + (BAYER4[j % 4][i % 4] < v - Math.floor(v) ? 1 : 0);
      c.set(x + i, y + j, fill[Math.min(k, fill.length - 1)]);
    }
  const outer = hex('#f0f0ff'), inner = hex('#8a8ad0'), dark = hex('#101030');
  for (let i = 1; i < w - 1; i++) c.set(x + i, y, outer), c.set(x + i, y + h - 1, outer), c.set(x + i, y + 1, inner), c.set(x + i, y + h - 2, dark);
  for (let j = 1; j < h - 1; j++) c.set(x, y + j, outer), c.set(x + w - 1, y + j, outer), c.set(x + 1, y + j, inner), c.set(x + w - 2, y + j, dark);
  for (const [i, j] of [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]]) c.set(x + i, y + j, [0, 0, 0, 0]);
}

/** Pointing-hand cursor, 10x8. */
export function cursor() {
  const p = { o: hex('#202020'), w: hex('#ffffff'), g: hex('#c8c8d8') };
  const rows = ['.oooo.....', 'owwwwoooo.', 'owwwwwwwwo', 'owwwwoooo.', 'owwwwwwo..', 'owgwwwwo..', '.ogggwo...', '..oooo....'];
  const c = new Canvas(10, 8);
  rows.forEach((r, y) => [...r].forEach((ch, x) => ch !== '.' && c.set(x, y, p[ch])));
  return c;
}

export { outline };
