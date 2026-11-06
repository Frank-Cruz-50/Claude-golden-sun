// Field tileset (16x16 tiles, 16 per row). Rows:
//   0  grass/path corner tiles (index = corner bits NW1 NE2 SW4 SE8; set bit = path)
//   1  grass/water corner tiles (set bit = water)
//   2  cliff face (index bits: top1 left2 right4 bottom8 = which edges are exposed)
//   3  misc: grass variants, door, tree, torch, barrel, rock, bush, flowers
//   4  variants: 0-5 plain grass, 6-8 plain path (picked by position to hide repetition)
//   5+ town and interior rows (see town.mjs)
import { Canvas, hex, rng, valueNoise, BAYER4 } from './lib.mjs';
import { buildTown, townCollidingTiles, TOWN_ROWS } from './town.mjs';

const T = 16;
export const COLS = 16;
export const MISC = {
  grassA: 0, grassB: 1, flowers: 2, pathB: 3, doorTop: 4, doorBottom: 5,
  treeTL: 6, treeTR: 7, treeBL: 8, treeBR: 9, torchTop: 10, torchBottom: 11, barrel: 12, rock: 13, bush: 14, stump: 15,
};
export const ROW = { path: 0, water: 1, cliff: 2, misc: 3, variants: 4 };
export const tileIndex = (row, col) => row * COLS + col;
export const TOTAL_ROWS = 5 + TOWN_ROWS;

export const C = {
  g0: hex('#24561c'), g1: hex('#347a24'), g2: hex('#4a9a2e'), g3: hex('#6cbc3a'), g4: hex('#9ad85a'),
  d0: hex('#7a4e26'), d1: hex('#a8743a'), d2: hex('#c8964e'), d3: hex('#e0b86c'), d4: hex('#f2d896'),
  w0: hex('#163a7a'), w1: hex('#2456b0'), w2: hex('#3a7ad8'), w3: hex('#7ab8f0'), w4: hex('#d8f0ff'),
  r0: hex('#24222e'), r1: hex('#4a4858'), r2: hex('#6e6c80'), r3: hex('#9896aa'), r4: hex('#c4c2d2'),
  o: hex('#1c1620'),
  b0: hex('#4a2a14'), b1: hex('#7a4622'), b2: hex('#a8682e'), b3: hex('#d0904a'),
  f0: hex('#e8503a'), f1: hex('#f8a830'), f2: hex('#fff0a0'),
  pink: hex('#f070a0'), white: hex('#ffffff'), yellow: hex('#f8e050'),
};

const wrap = (v) => ((v % T) + T) % T;

/** Paints the grass texture into tile (ox,oy) of canvas, where mask(x,y) allows it. */
export function grassTexture(c, ox, oy, seed, mask = () => true) {
  const n = valueNoise(seed, 4);
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++) {
      if (!mask(x, y)) continue;
      const v = n(x / 4, y / 4);
      c.set(ox + x, oy + y, v + (BAYER4[y % 4][x % 4] - 0.5) * 0.35 > 0.55 ? C.g2 : C.g1);
    }
  const r = rng(seed * 7 + 3);
  for (let i = 0; i < 9; i++) {
    const x = Math.floor(r() * T), y = Math.floor(r() * T);
    // a little tuft: light blades over a dark root
    const pts = [[0, 0, C.g4], [-1, 1, C.g3], [1, 1, C.g3], [0, 1, C.g3], [0, 2, C.g0], [-1, 2, C.g1], [1, 2, C.g1]];
    for (const [dx, dy, col] of pts) {
      const px = wrap(x + dx), py = wrap(y + dy);
      if (mask(px, py)) c.set(ox + px, oy + py, col);
    }
  }
}

export function dirtTexture(c, ox, oy, seed, mask = () => true) {
  const n = valueNoise(seed, 4);
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++) {
      if (!mask(x, y)) continue;
      const v = n(x / 4, y / 4) + (BAYER4[y % 4][x % 4] - 0.5) * 0.4;
      c.set(ox + x, oy + y, v > 0.62 ? C.d3 : v > 0.3 ? C.d2 : C.d1);
    }
  const r = rng(seed * 13 + 1);
  for (let i = 0; i < 4; i++) {
    const x = Math.floor(r() * T), y = Math.floor(r() * T);
    if (mask(x, y)) c.set(ox + x, oy + y, C.d4);
    if (mask(x, wrap(y + 1))) c.set(ox + x, oy + wrap(y + 1), C.d0);
  }
}

export function waterTexture(c, ox, oy, seed, mask = () => true) {
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++) if (mask(x, y)) c.set(ox + x, oy + y, (x + y * 3) % 11 === 0 ? C.w2 : C.w1);
  const r = rng(seed);
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(r() * T), y = Math.floor(r() * T), len = 2 + Math.floor(r() * 3);
    for (let k = 0; k < len; k++) if (mask(wrap(x + k), y)) c.set(ox + wrap(x + k), oy + y, k === 0 ? C.w4 : C.w3);
  }
}

/**
 * Corner-blended terrain: corners (NW,NE,SW,SE) are 0/1. A wobbly boundary is
 * drawn where the bilinear field crosses 0.5; the wobble fades to zero at tile
 * edges so neighbouring tiles always line up.
 */
export function cornerMask(bits, seed) {
  const k = [bits & 1, (bits >> 1) & 1, (bits >> 2) & 1, (bits >> 3) & 1].map(Number);
  const n = valueNoise(seed, 4);
  return (x, y) => {
    const u = (x + 0.5) / T, v = (y + 0.5) / T;
    const f = k[0] * (1 - u) * (1 - v) + k[1] * u * (1 - v) + k[2] * (1 - u) * v + k[3] * u * v;
    const wobble = (n(x / 5, y / 5) - 0.5) * 0.22 * Math.sin(Math.PI * u) * Math.sin(Math.PI * v);
    return f + wobble > 0.5;
  };
}

/** 16 corner-blend tiles of `fill` over `outside` (grass by default). */
export function blendRow(c, row, fill, edgeOut, edgeIn, outside = grassTexture) {
  for (let bits = 0; bits < 16; bits++) {
    const ox = bits * T, oy = row * T;
    const inB = cornerMask(bits, 40 + bits);
    outside(c, ox, oy, 11 + (bits % 3), (x, y) => !inB(x, y));
    fill(c, ox, oy, 5 + bits, inB);
    // edge lines: dark rim on the grass side, highlight/shadow on the inner side
    for (let y = 0; y < T; y++)
      for (let x = 0; x < T; x++) {
        const here = inB(x, y);
        const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= T || ny >= T) return false;
          return inB(nx, ny) !== here;
        });
        if (!nb) continue;
        if (!here) c.set(ox + x, oy + y, edgeOut);
        else if (y > 0 && !inB(x, y - 1)) c.set(ox + x, oy + y, edgeIn);
      }
  }
}

/** Grass overhang along the top of a cliff tile, with a ragged lower edge. */
function grassLip(c, ox, oy) {
  const n = valueNoise(91, 4);
  for (let x = 0; x < T; x++) {
    const depth = 3 + Math.round(n(x / 3, 0) * 2);
    for (let y = 0; y < depth; y++) c.set(ox + x, oy + y, y === 0 ? C.g3 : C.g2);
    c.set(ox + x, oy + depth, C.g0);
    c.set(ox + x, oy + depth + 1, C.o);
  }
}

/** Stone wall texture: rows of rounded stones with dark mortar, tileable. */
export function stoneFace(seed) {
  const c = new Canvas(T, T);
  const r = rng(seed);
  c.rect(0, 0, T, T, C.r0);
  const rows = [[0, 5], [5, 6], [11, 5]];
  rows.forEach(([y0, h], ri) => {
    let x = ri % 2 ? -4 : 0;
    while (x < T) {
      const w = 5 + Math.floor(r() * 4);
      for (let j = 0; j < h - 1; j++)
        for (let i = 0; i < w - 1; i++) {
          const corner = (i === 0 || i === w - 2) && (j === 0 || j === h - 2);
          if (corner) continue;
          const lit = j === 0 || i === 0 ? C.r3 : j === h - 2 || i === w - 2 ? C.r1 : C.r2;
          c.set(wrap(x + i), y0 + j, lit);
        }
      c.set(wrap(x + 1), y0 + 1, C.r4);
      x += w;
    }
  });
  return c;
}

function cliffRow(c) {
  const face = stoneFace(77);
  for (let bits = 0; bits < 16; bits++) {
    const ox = bits * T, oy = ROW.cliff * T;
    c.blit(face, ox, oy);
    const top = bits & 1, left = bits & 2, right = bits & 4, bottom = bits & 8;
    if (top) grassLip(c, ox, oy);
    if (left) for (let y = 0; y < T; y++) c.set(ox, oy + y, C.o), c.set(ox + 1, oy + y, C.r3);
    if (right) for (let y = 0; y < T; y++) c.set(ox + T - 1, oy + y, C.o), c.set(ox + T - 2, oy + y, C.r1);
    if (bottom) for (let x = 0; x < T; x++) c.set(ox + x, oy + T - 1, C.o), c.set(ox + x, oy + T - 2, C.r1);
  }
}

function drawMisc(c) {
  const at = (key) => [MISC[key] * T, ROW.misc * T];
  const put = (key, pts) => {
    const [ox, oy] = at(key);
    for (const [x, y, col] of pts) c.set(ox + x, oy + y, col);
  };
  grassTexture(c, ...at('grassA'), 21);
  grassTexture(c, ...at('grassB'), 22);
  grassTexture(c, ...at('flowers'), 23);
  put('flowers', [[3, 4, C.pink], [4, 3, C.pink], [5, 4, C.pink], [4, 5, C.pink], [4, 4, C.yellow],
    [11, 10, C.white], [12, 9, C.white], [13, 10, C.white], [12, 11, C.white], [12, 10, C.yellow],
    [9, 3, C.yellow], [6, 12, C.white]]);
  dirtTexture(c, ...at('pathB'), 31);

  // Arched wooden door set into the cliff face (two tiles tall)
  const face = stoneFace(77);
  const [dtx, dty] = at('doorTop');
  const [dbx, dby] = at('doorBottom');
  c.blit(face, dtx, dty);
  c.blit(face, dbx, dby);
  for (let y = 0; y < 32; y++)
    for (let x = 1; x < 15; x++) {
      const cx = x - 7.5, cy = y - 13;
      const inArch = y >= 13 || cx * cx + cy * cy * 1.2 < 49;
      if (!inArch) continue;
      const edge = !(y >= 13 || (cx * cx + (cy + 1) ** 2 * 1.2 < 49 && Math.abs(cx) < 6.5)) || x === 1 || x === 14;
      const plank = x % 4 === 2 ? C.b1 : x % 4 === 0 ? C.b3 : C.b2;
      const col = edge ? C.o : y === 31 ? C.b0 : plank;
      const [bx, by] = y < 16 ? [dtx, dty + y] : [dbx, dby + y - 16];
      c.set(bx + x, by, col);
    }
  for (let x = 2; x < 14; x++) c.set(dbx + x, dby + 9, C.b0);
  for (let x = 2; x < 14; x++) c.set(dbx + x, dby + 2, C.b0);
  grassLip(c, dtx, dty);
  c.set(dbx + 11, dby + 5, C.f2); c.set(dbx + 11, dby + 6, C.b0);

  // Tree: 2x2 tiles, round canopy over a short trunk.
  const tree = new Canvas(32, 32);
  const leaf = [C.g0, C.g1, C.g2, C.g3, C.g4];
  const n = valueNoise(5, 6);
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      const dx = (x - 15.5) / 15, dy = (y - 12) / 12.5;
      const bump = (n(x / 4, y / 4) - 0.5) * 0.35;
      const d = dx * dx + dy * dy;
      if (d < 1 + bump && y < 26) {
        const light = (-(x - 15.5) * 0.6 - (y - 12) * 0.8) / 14 + 0.45 + (n(x / 2, y / 2) - 0.5) * 0.6;
        const i = Math.max(0, Math.min(4, Math.floor(light * 4 + BAYER4[y % 4][x % 4])));
        tree.set(x, y, leaf[i]);
      }
    }
  for (let y = 22; y < 31; y++) for (let x = 12; x < 20; x++) if (!tree.get(x, y)[3] || y > 24) tree.set(x, y, x < 14 ? C.b1 : x > 17 ? C.b0 : C.b2);
  outline(tree);
  for (let x = 9; x < 23; x++) if (!tree.get(x, 31)[3]) tree.set(x, 31, hex('#000000', 90));
  const tl = at('treeTL'), tr = at('treeTR'), bl = at('treeBL'), br = at('treeBR');
  c.blit(tree, tl[0], tl[1], 0, 0, 16, 16);
  c.blit(tree, tr[0], tr[1], 16, 0, 16, 16);
  grassTexture(c, bl[0], bl[1], 24);
  grassTexture(c, br[0], br[1], 25);
  c.blit(tree, bl[0], bl[1], 0, 16, 16, 16);
  c.blit(tree, br[0], br[1], 16, 16, 16, 16);

  // Torch on a tripod stand (two tiles: flame in the top tile)
  const torch = new Canvas(16, 32);
  const flame = [[7, 4, C.f0], [8, 4, C.f0], [6, 5, C.f0], [7, 5, C.f1], [8, 5, C.f1], [9, 5, C.f0], [6, 6, C.f1], [7, 6, C.f2], [8, 6, C.f2], [9, 6, C.f1],
    [7, 2, C.f0], [8, 3, C.f1], [7, 3, C.f1], [6, 7, C.f1], [7, 7, C.f2], [8, 7, C.f2], [9, 7, C.f1], [7, 1, C.f0]];
  for (const [x, y, col] of flame) torch.set(x, y + 6, col);
  for (let x = 4; x < 12; x++) torch.set(x, 14, C.b1), torch.set(x, 15, C.b0);
  for (let y = 16; y < 30; y++) {
    torch.set(7, y, C.b2);
    torch.set(8, y, C.b1);
    const spread = Math.floor((y - 16) / 3);
    if (y > 20) torch.set(7 - spread, y, C.b1), torch.set(8 + spread, y, C.b0);
  }
  outline(torch);
  for (let x = 4; x < 12; x++) if (!torch.get(x, 30)[3]) torch.set(x, 30, hex('#000000', 90));
  const tt = at('torchTop'), tb = at('torchBottom');
  c.blit(torch, tt[0], tt[1], 0, 0, 16, 16);
  grassTexture(c, tb[0], tb[1], 26);
  c.blit(torch, tb[0], tb[1], 0, 16, 16, 16);

  // Barrel, rock, bush, stump (on grass)
  const props = {
    barrel: (p) => {
      for (let y = 2; y < 15; y++)
        for (let x = 3; x < 13; x++) {
          const bulge = y > 3 && y < 13 ? 0 : 1;
          if (x < 3 + bulge || x > 12 - bulge) continue;
          let col = x < 6 ? C.b3 : x > 10 ? C.b1 : C.b2;
          if (y === 4 || y === 11) col = C.r2;
          if (y === 2) col = C.b1;
          p.set(x, y, col);
        }
    },
    rock: (p) => {
      for (let y = 6; y < 15; y++)
        for (let x = 2; x < 14; x++) {
          const dx = (x - 7.5) / 6, dy = (y - 10.5) / 4.5;
          if (dx * dx + dy * dy > 1) continue;
          p.set(x, y, dx + dy < -0.6 ? C.r4 : dx + dy < 0.2 ? C.r3 : dx + dy < 0.8 ? C.r2 : C.r1);
        }
    },
    bush: (p) => {
      const nb = valueNoise(8, 4);
      for (let y = 2; y < 15; y++)
        for (let x = 1; x < 15; x++) {
          const dx = (x - 7.5) / 7, dy = (y - 8.5) / 6.5;
          if (dx * dx + dy * dy > 1 + (nb(x / 2, y / 2) - 0.5) * 0.4) continue;
          const l = (-dx - dy) * 0.5 + 0.5 + (nb(x, y) - 0.5) * 0.5;
          p.set(x, y, leaf[Math.max(1, Math.min(4, Math.floor(l * 4 + BAYER4[y % 4][x % 4] * 0.8)))]);
        }
    },
    stump: (p) => {
      for (let y = 7; y < 15; y++) for (let x = 4; x < 12; x++) p.set(x, y, x < 6 ? C.b3 : x > 9 ? C.b0 : C.b1);
      for (let x = 4; x < 12; x++) p.set(x, 6, C.d3), p.set(x, 7, C.d2);
      p.set(7, 6, C.d1);
    },
  };
  for (const [key, draw] of Object.entries(props)) {
    const p = new Canvas(16, 16);
    draw(p);
    outline(p);
    for (let x = 3; x < 13; x++) if (!p.get(x, 15)[3]) p.set(x, 15, hex('#000000', 90));
    const [ox, oy] = at(key);
    grassTexture(c, ox, oy, 30 + MISC[key]);
    c.blit(p, ox, oy);
  }
}

/** Adds a 1px dark outline around opaque pixels (in place). */
export function outline(p) {
  const opaque = (x, y) => p.get(x, y)[3] > 200;
  const add = [];
  for (let y = 0; y < p.h; y++)
    for (let x = 0; x < p.w; x++)
      if (!opaque(x, y) && (opaque(x - 1, y) || opaque(x + 1, y) || opaque(x, y - 1) || opaque(x, y + 1))) add.push([x, y]);
  for (const [x, y] of add) p.set(x, y, C.o);
}

export function buildTileset() {
  const c = new Canvas(COLS * T, TOTAL_ROWS * T);
  blendRow(c, ROW.path, dirtTexture, C.g0, C.d4);
  blendRow(c, ROW.water, waterTexture, C.g0, C.w4);
  cliffRow(c);
  drawMisc(c);
  for (let i = 0; i < 6; i++) grassTexture(c, i * T, ROW.variants * T, 101 + i);
  for (let i = 0; i < 3; i++) dirtTexture(c, (6 + i) * T, ROW.variants * T, 201 + i);
  buildTown(c);
  return c;
}

/** Tile ids (0-based, within this tileset) that block movement. */
export function collidingTiles() {
  const ids = [];
  for (let bits = 0; bits < 16; bits++) {
    const water = [1, 2, 4, 8].filter((b) => bits & b).length;
    if (water >= 3) ids.push(tileIndex(ROW.water, bits));
    ids.push(tileIndex(ROW.cliff, bits));
  }
  for (const k of ['doorTop', 'treeBL', 'treeBR', 'torchBottom', 'barrel', 'rock', 'bush', 'stump']) ids.push(tileIndex(ROW.misc, MISC[k]));
  ids.push(...townCollidingTiles());
  return ids.sort((a, b) => a - b);
}
