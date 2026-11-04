// "Material map" sprite pipeline: author flat material letters, get 4-tone
// shading, coloured selective outlines, and inter-material shadow lines.
import { Canvas, hex, BAYER4 } from './lib.mjs';

/** Mirrors 12-wide left halves into 24-wide rows (for front/back views). */
export function mirror(rows) {
  return rows.map((r) => r + [...r].reverse().join(''));
}

/** Overlays rows onto base rows; '.' in the overlay keeps the base pixel. */
export function overlay(base, top, dy = 0) {
  const out = [...base];
  top.forEach((r, j) => {
    const y = j + dy;
    out[y] = [...out[y]].map((ch, x) => (r[x] && r[x] !== '.' ? r[x] : ch)).join('');
  });
  return out;
}

const darken = (c, f) => [Math.round(c[0] * f), Math.round(c[1] * f), Math.round(c[2] * f), 255];

/**
 * materials: { letter: [darkest, dark, mid, light] } (hex strings)
 * details:   { letter: hex } — flat colours drawn as-is (eyes, buckles, highlights)
 */
export function renderSprite(rows, materials, details = {}) {
  const h = rows.length, w = rows[0].length;
  rows.forEach((r, y) => {
    if (r.length !== w) throw new Error(`row ${y} is ${r.length} wide, expected ${w}: "${r}"`);
  });
  const ramps = Object.fromEntries(Object.entries(materials).map(([k, v]) => [k, v.map((x) => hex(x))]));
  const flat = Object.fromEntries(Object.entries(details).map(([k, v]) => [k, hex(v)]));
  const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? '.' : rows[y][x]);
  // detail pixels belong to the surrounding material for shading purposes
  const matAt = (x, y) => {
    const ch = at(x, y);
    if (ch === '.' || ramps[ch]) return ch;
    for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
      const n = at(x + dx, y + dy);
      if (ramps[n]) return n;
    }
    return ch;
  };
  const c = new Canvas(w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const ch = at(x, y);
      if (ch === '.') continue;
      if (flat[ch]) {
        c.set(x, y, flat[ch]);
        continue;
      }
      const ramp = ramps[ch];
      if (!ramp) throw new Error(`unknown material '${ch}'`);
      const same = (dx, dy) => matAt(x + dx, y + dy) === ch;
      // distance to region edge in each direction (capped) → rounded volume
      const run = (dx, dy) => {
        let k = 0;
        while (k < 4 && same(dx * (k + 1), dy * (k + 1))) k++;
        return k;
      };
      const up = run(0, -1), down = run(0, 1), left = run(-1, 0), right = run(1, 0);
      let t = 1.6 + (Math.min(up, 3) - Math.min(down, 3)) * -0.22 + (Math.min(left, 3) - Math.min(right, 3)) * -0.16;
      t += (Math.min(up, down, left, right) >= 2 ? 0.35 : 0);
      if (up === 0) t += 0.5; // top edges catch light
      if (down === 0) t -= 0.7; // bottom edges fall into shadow
      if (right === 0 && left > 0) t -= 0.3;
      // shadow line under a different material above (e.g. hair onto forehead)
      const above = matAt(x, y - 1);
      if (above !== ch && above !== '.' && ramps[above]) t -= 1.2;
      const d = BAYER4[y % 4][x % 4] - 0.5;
      const i = Math.max(0, Math.min(3, Math.round(t + d * 0.6)));
      c.set(x, y, ramp[i]);
    }
  // selective outline: dark tint of the neighbouring material
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (at(x, y) !== '.') continue;
      let col = null;
      for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
        const m = matAt(x + dx, y + dy);
        if (m !== '.' && ramps[m]) {
          col = darken(ramps[m][0], 0.45);
          break;
        }
        if (m !== '.' && flat[m]) {
          col = darken(flat[m], 0.35);
          break;
        }
      }
      if (col) c.set(x, y, col);
    }
  return c;
}
