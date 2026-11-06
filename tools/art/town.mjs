// Town and interior tiles, appended to the field tileset from row 5.
//   5  roof      (bits: top1 left2 right4 bottom8 = exposed edges)
//   6  wall      (bits: left1 right2 top4 bottom8)
//   7  cobble    corner blend over grass (bits NW1 NE2 SW4 SE8)
//   8  fence     (bits: left1 right2 up4 down8 = connections)
//   9  town misc (TOWN)
//   10 floor     (bits: left1 right2 bottom4 = edge against wall/void) + interior misc (INTERIOR)
//   11 rug       (bits: top1 left2 right4 bottom8 = edges with a trim border)
//   12 furniture (FURNITURE)
import { Canvas, hex, rng, valueNoise, BAYER4 } from './lib.mjs';
import { blendRow, C, dirtTexture, grassTexture, outline, waterTexture } from './tiles.mjs';

const T = 16;
const COLS = 16;
export const TOWN_ROWS = 8;
export const TROW = { roof: 5, wall: 6, cobble: 7, fence: 8, town: 9, floor: 10, rug: 11, furniture: 12 };
export const TOWN = {
  window: 0, doorTop: 1, doorBottom: 2, hedge: 3, wellBase: 4, wellRoof: 5, bridge: 6, lampBase: 7, lampTop: 8,
  crate: 9, flowerbed: 10, chimney: 11, sign: 12, pathStone: 13,
};
// row 10: floor edge variants use cols 0-7; the rest are interior pieces
export const INTERIOR = { wallUpper: 8, wallLower: 9, void: 10, doormat: 11, shelfTop: 12, shelfBottom: 13, windowIn: 14, wallLowerPlain: 15 };
export const FURNITURE = {
  fireTL: 0, fireTR: 1, fireBL: 2, fireBR: 3, bedTop: 4, bedBottom: 5, tableL: 6, tableR: 7, chair: 8,
  barrel: 9, crate: 10, pot: 11, chest: 12, stool: 13,
};
const idx = (row, col) => row * COLS + col;

const P = {
  roof: ['#5a1a14', '#8a2c1e', '#b84a2c', '#e07848', '#f8a870'].map((x) => hex(x)),
  plaster: ['#a8906a', '#cdb68a', '#e8d6aa', '#f8ecca'].map((x) => hex(x)),
  timber: ['#2e1a0e', '#4e2e16', '#6e4422', '#8e5e30'].map((x) => hex(x)),
  stone: ['#3a3846', '#5e5c6e', '#868498', '#b0aec0', '#d4d2e0'].map((x) => hex(x)),
  floor: ['#5a3418', '#7e4c24', '#a06634', '#c08248', '#d8a060'].map((x) => hex(x)),
  rug: ['#5a1430', '#8a2442', '#b8385a', '#d86a7a'].map((x) => hex(x)),
  gold: ['#7a5a10', '#c8a030', '#f0d060'].map((x) => hex(x)),
  glass: ['#24406a', '#3a6ab0', '#7ab0e8', '#d8f0ff'].map((x) => hex(x)),
  leaf: ['#24561c', '#347a24', '#4a9a2e', '#6cbc3a', '#9ad85a'].map((x) => hex(x)),
  white: hex('#ffffff'),
  black: hex('#0c0a10'),
  shadow: hex('#000000', 80),
};

const dith = (x, y, v) => v + (BAYER4[y % 4][x % 4] - 0.5);
const pick = (ramp, v) => ramp[Math.max(0, Math.min(ramp.length - 1, Math.round(v)))];
const at = (row, col) => [col * T, row * T];

// ---------- roofs: overlapping clay tiles in staggered courses ----------
function roofRow(c) {
  for (let bits = 0; bits < 16; bits++) {
    const [ox, oy] = at(TROW.roof, bits);
    for (let y = 0; y < T; y++)
      for (let x = 0; x < T; x++) {
        const course = Math.floor(y / 4), yy = y % 4;
        const xx = (x + (course % 2) * 2) % 4;
        let v = 2.3 - yy * 0.45 + (xx === 0 ? -0.8 : xx === 1 ? 0.5 : 0);
        if (yy === 3) v = 0.6;
        c.set(ox + x, oy + y, pick(P.roof, dith(x, y, v)));
      }
    const top = bits & 1, left = bits & 2, right = bits & 4, bottom = bits & 8;
    if (top) for (let x = 0; x < T; x++) { c.set(ox + x, oy, P.roof[0]); c.set(ox + x, oy + 1, P.roof[4]); c.set(ox + x, oy + 2, P.roof[3]); c.set(ox + x, oy + 3, P.roof[1]); }
    if (bottom) for (let x = 0; x < T; x++) { c.set(ox + x, oy + 13, P.roof[3]); c.set(ox + x, oy + 14, P.timber[2]); c.set(ox + x, oy + 15, P.black); }
    if (left) for (let y = 0; y < T; y++) { c.set(ox, oy + y, P.black); c.set(ox + 1, oy + y, P.timber[3]); c.set(ox + 2, oy + y, P.timber[1]); }
    if (right) for (let y = 0; y < T; y++) { c.set(ox + 15, oy + y, P.black); c.set(ox + 14, oy + y, P.timber[1]); c.set(ox + 13, oy + y, P.timber[2]); }
  }
}

// ---------- walls: plaster between timber posts and beams ----------
function plaster(c, ox, oy, seed) {
  const n = valueNoise(seed, 4);
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) c.set(ox + x, oy + y, pick(P.plaster, dith(x, y, 1.6 + n(x / 3, y / 3) * 1.2)));
}
function wallRow(c) {
  for (let bits = 0; bits < 16; bits++) {
    const [ox, oy] = at(TROW.wall, bits);
    plaster(c, ox, oy, 60 + bits);
    const left = bits & 1, right = bits & 2, top = bits & 4, bottom = bits & 8;
    if (top) {
      for (let x = 0; x < T; x++) { c.set(ox + x, oy, P.black); c.set(ox + x, oy + 1, P.timber[3]); c.set(ox + x, oy + 2, P.timber[1]); c.set(ox + x, oy + 3, P.shadow); }
    }
    if (bottom) {
      // stone foundation
      for (let y = 11; y < T; y++)
        for (let x = 0; x < T; x++) {
          const stoneEdge = y === 11 || x % 6 === ((y > 13) * 3) % 6;
          c.set(ox + x, oy + y, stoneEdge ? P.stone[1] : pick(P.stone, dith(x, y, y === 12 ? 3.4 : 2.4)));
        }
      for (let x = 0; x < T; x++) c.set(ox + x, oy + 15, P.stone[0]);
    }
    const post = (px, lit) => {
      for (let y = top ? 1 : 0; y < (bottom ? 11 : T); y++) { c.set(ox + px, oy + y, lit ? P.timber[3] : P.timber[1]); c.set(ox + px + 1, oy + y, lit ? P.timber[2] : P.timber[0]); }
    };
    if (left) { post(0, true); }
    if (right) { post(14, false); }
  }
}

// ---------- cobblestones (corner blend over grass) ----------
export function cobbleTexture(c, ox, oy, seed, mask = () => true) {
  const r = rng(seed + 5);
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) if (mask(x, y)) c.set(ox + x, oy + y, P.stone[1]);
  // irregular rounded stones on a 4x4-ish grid with jitter
  for (let gy = 0; gy < 4; gy++)
    for (let gx = 0; gx < 4; gx++) {
      const cx = gx * 4 + 1.5 + (gy % 2) * 2 + (r() - 0.5), cy = gy * 4 + 1.5 + (r() - 0.5) * 0.5;
      const rx = 1.6 + r() * 0.5, ry = 1.3 + r() * 0.4;
      for (let y = Math.floor(cy - 2); y <= cy + 2; y++)
        for (let x = Math.floor(cx - 3); x <= cx + 3; x++) {
          const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
          const wx = ((x % T) + T) % T, wy = ((y % T) + T) % T;
          if (d > 1 || !mask(wx, wy)) continue;
          const lit = (cx - x) * 0.6 + (cy - y) * 0.8;
          c.set(ox + wx, oy + wy, pick(P.stone, 2.3 + lit * 0.7));
        }
    }
}

// ---------- fences (connections: left1 right2 up4 down8) ----------
function fenceRow(c) {
  for (let bits = 0; bits < 16; bits++) {
    const [ox, oy] = at(TROW.fence, bits);
    grassTexture(c, ox, oy, 300 + bits);
    const p = new Canvas(T, T);
    const L = bits & 1, R = bits & 2, U = bits & 4, D = bits & 8;
    const wood = (x, y, lit) => p.set(x, y, lit ? P.timber[3] : P.timber[2]);
    // horizontal rails
    if (L || R || !(U || D)) {
      const x0 = L ? 0 : 6, x1 = R ? 15 : 9;
      for (let x = x0; x <= x1; x++) { wood(x, 5, true); wood(x, 6, false); wood(x, 10, true); wood(x, 11, false); }
    }
    // vertical rails (seen from above: a long thin rail)
    if (U || D) {
      const y0 = U ? 0 : 3, y1 = D ? 15 : 13;
      for (let y = y0; y <= y1; y++) { wood(7, y, true); wood(8, y, false); }
    }
    // post
    for (let y = 2; y < 14; y++) { p.set(6, y, P.timber[3]); p.set(7, y, P.timber[2]); p.set(8, y, P.timber[2]); p.set(9, y, P.timber[1]); }
    for (let x = 6; x < 10; x++) p.set(x, 2, P.timber[3]);
    outline(p);
    for (let x = 5; x < 11; x++) if (!p.get(x, 14)[3]) p.set(x, 14, P.shadow);
    c.blit(p, ox, oy);
  }
}

// ---------- town misc ----------
function townMisc(c) {
  const put = (key) => at(TROW.town, TOWN[key]);
  // window on a plain wall: frame, panes, shutters, flower box
  {
    const [ox, oy] = put('window');
    plaster(c, ox, oy, 91);
    for (let y = 2; y < 12; y++) for (let x = 3; x < 13; x++) c.set(ox + x, oy + y, P.timber[1]);
    for (let y = 3; y < 11; y++) for (let x = 4; x < 12; x++) c.set(ox + x, oy + y, pick(P.glass, 2 - (y - 3) * 0.25 + (x < 6 ? 0.6 : 0)));
    for (let y = 3; y < 11; y++) c.set(ox + 7, oy + y, P.timber[2]), c.set(ox + 8, oy + y, P.timber[1]);
    for (let x = 4; x < 12; x++) c.set(ox + x, oy + 6, P.timber[2]);
    c.set(ox + 5, oy + 4, P.white); c.set(ox + 9, oy + 4, P.white);
    for (let y = 2; y < 12; y++) { c.set(ox + 1, oy + y, hex('#3a7a4a')); c.set(ox + 2, oy + y, hex('#2a5a3a')); c.set(ox + 13, oy + y, hex('#3a7a4a')); c.set(ox + 14, oy + y, hex('#2a5a3a')); }
    for (let x = 2; x < 14; x++) { c.set(ox + x, oy + 12, P.timber[2]); c.set(ox + x, oy + 13, P.timber[0]); }
    for (const [x, col] of [[3, C.pink], [5, C.yellow], [8, C.pink], [10, C.white], [12, C.yellow]]) { c.set(ox + x, oy + 11, col); c.set(ox + x + 1, oy + 11, C.g3); }
  }
  // house door: two tiles, arched lintel in the top one
  {
    const [tx, ty] = put('doorTop');
    const [bx, by] = put('doorBottom');
    plaster(c, tx, ty, 92);
    plaster(c, bx, by, 93);
    const door = new Canvas(T, 32);
    for (let y = 6; y < 32; y++)
      for (let x = 2; x < 14; x++) {
        const cx = x - 7.5, cy = y - 11;
        if (y < 11 && cx * cx + cy * cy > 30) continue;
        const plank = x % 3 === 2 ? P.timber[1] : x < 5 ? P.timber[3] : P.timber[2];
        door.set(x, y, plank);
      }
    for (let x = 3; x < 13; x++) { door.set(x, 16, P.timber[0]); door.set(x, 25, P.timber[0]); }
    door.set(11, 20, P.gold[2]); door.set(11, 21, P.gold[0]);
    outline(door);
    for (let x = 1; x < 15; x++) { door.set(x, 30, P.stone[3]); door.set(x, 31, P.stone[1]); } // step
    c.blit(door, tx, ty, 0, 0, T, T);
    c.blit(door, bx, by, 0, 16, T, T);
  }
  // hedge (full tile, rounded leafy top)
  {
    const [ox, oy] = put('hedge');
    const n = valueNoise(17, 4);
    for (let y = 0; y < T; y++)
      for (let x = 0; x < T; x++) {
        const v = 2.2 - y * 0.12 + (n(x / 2, y / 2) - 0.5) * 2.2 + (y < 3 ? 1 : 0);
        c.set(ox + x, oy + y, pick(P.leaf, dith(x, y, v)));
      }
    for (let x = 0; x < T; x++) c.set(ox + x, oy + 15, C.g0);
  }
  // well: stone ring with water (base, blocks) + wooden roof (above layer)
  {
    const [ox, oy] = put('wellBase');
    grassTexture(c, ox, oy, 310);
    const p = new Canvas(T, T);
    for (let y = 2; y < 15; y++)
      for (let x = 1; x < 15; x++) {
        const d = ((x - 7.5) / 6.5) ** 2 + ((y - 8.5) / 6) ** 2;
        if (d > 1) continue;
        const inner = ((x - 7.5) / 4) ** 2 + ((y - 7.5) / 3.2) ** 2 < 1;
        p.set(x, y, inner ? (y < 7 ? P.glass[0] : P.glass[1]) : pick(P.stone, y < 8 ? 3.4 : 2));
      }
    for (const x of [2, 13]) for (let y = 0; y < 9; y++) p.set(x, y, P.timber[2]);
    outline(p);
    c.blit(p, ox, oy);
    const [rx, ry] = put('wellRoof');
    const roof = new Canvas(T, T);
    for (let y = 4; y < 13; y++) for (let x = 0; x < T; x++) {
      const w = Math.min(16, 8 + (y - 4) * 2);
      if (Math.abs(x - 7.5) > w / 2) continue;
      roof.set(x, y, pick(P.roof, 3.6 - (y - 4) * 0.35 + (x < 6 ? 0.4 : -0.2)));
    }
    for (const x of [2, 13]) for (let y = 13; y < 16; y++) roof.set(x, y, P.timber[2]);
    outline(roof);
    c.blit(roof, rx, ry);
  }
  // bridge planks over water
  {
    const [ox, oy] = put('bridge');
    waterTexture(c, ox, oy, 320);
    for (let y = 2; y < 14; y++) for (let x = 0; x < T; x++) c.set(ox + x, oy + y, x % 4 === 3 ? P.timber[1] : y === 2 ? P.timber[3] : P.timber[2]);
    for (let x = 0; x < T; x++) { c.set(ox + x, oy + 1, P.timber[0]); c.set(ox + x, oy + 14, P.timber[0]); c.set(ox + x, oy + 15, hex('#102a5a')); }
  }
  // lamp post: base blocks; lantern top in the above layer
  {
    const [bx, by] = put('lampBase');
    grassTexture(c, bx, by, 330);
    const p = new Canvas(T, 32);
    for (let y = 8; y < 30; y++) { p.set(7, y, P.timber[0]); p.set(8, y, P.timber[1]); }
    for (let x = 5; x < 11; x++) { p.set(x, 29, P.timber[1]); p.set(x, 30, P.timber[0]); }
    for (let y = 2; y < 9; y++) for (let x = 5; x < 11; x++) p.set(x, y, y === 2 || y === 8 ? P.timber[0] : x === 5 || x === 10 ? P.timber[1] : y < 5 ? C.f2 : C.f1);
    outline(p);
    for (let x = 4; x < 12; x++) if (!p.get(x, 31)[3]) p.set(x, 31, P.shadow);
    const [tx, ty] = put('lampTop');
    c.blit(p, tx, ty, 0, 0, T, T);
    c.blit(p, bx, by, 0, 16, T, T);
  }
  // crate, flowerbed, chimney, signpost-tile, stepping stones
  {
    const [ox, oy] = put('crate');
    grassTexture(c, ox, oy, 340);
    const p = new Canvas(T, T);
    for (let y = 3; y < 15; y++) for (let x = 2; x < 14; x++) p.set(x, y, y < 6 ? P.timber[3] : x === 2 || x === 13 || y === 14 || (x - 2 === y - 3) ? P.timber[1] : P.timber[2]);
    outline(p);
    c.blit(p, ox, oy);
  }
  {
    const [ox, oy] = put('flowerbed');
    dirtTexture(c, ox, oy, 350);
    const r = rng(7);
    for (let i = 0; i < 9; i++) {
      const x = 1 + Math.floor(r() * 13), y = 1 + Math.floor(r() * 13);
      const col = [C.pink, C.yellow, C.white, C.f0][i % 4];
      c.set(ox + x, oy + y + 1, C.g1); c.set(ox + x, oy + y, col); c.set(ox + x + 1, oy + y, col); c.set(ox + x, oy + y - 1, col);
    }
  }
  {
    const [ox, oy] = put('chimney');
    const p = new Canvas(T, T);
    for (let y = 0; y < 14; y++) for (let x = 4; x < 12; x++) p.set(x, y, y < 2 ? P.stone[4] : (x + (y % 4 < 2 ? 0 : 2)) % 4 === 0 || y % 4 === 3 ? P.stone[1] : P.stone[x < 7 ? 3 : 2]);
    outline(p);
    // drawn over a roof tile in the map builder; here keep a roof underlay so it previews nicely
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
      const course = Math.floor(y / 4), xx = (x + (course % 2) * 2) % 4;
      c.set(ox + x, oy + y, pick(P.roof, dith(x, y, 2.3 - (y % 4) * 0.45 + (xx === 0 ? -0.8 : 0))));
    }
    c.blit(p, ox, oy);
  }
  {
    const [ox, oy] = put('pathStone');
    grassTexture(c, ox, oy, 360);
    for (const [cx, cy] of [[4, 5], [11, 11]]) for (let y = -2; y <= 2; y++) for (let x = -3; x <= 3; x++) if ((x / 3) ** 2 + (y / 2.2) ** 2 <= 1) c.set(ox + cx + x, oy + cy + y, pick(P.stone, 2.6 - (x + y) * 0.3));
  }
}

// ---------- interiors ----------
function floorTexture(c, ox, oy, seed, mask = () => true) {
  const n = valueNoise(seed, 4);
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++) {
      if (!mask(x, y)) continue;
      const board = Math.floor(y / 4);
      const seam = y % 4 === 3 || (x + board * 5) % 16 === 0;
      c.set(ox + x, oy + y, seam ? P.floor[1] : pick(P.floor, dith(x, y, 2.6 + (n(x / 4, board) - 0.5) * 1.2)));
    }
}
function rugTexture(c, ox, oy, seed, mask = () => true) {
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++) {
      if (!mask(x, y)) continue;
      const diamond = (Math.abs((x % 8) - 3.5) + Math.abs((y % 8) - 3.5)) < 2.5;
      c.set(ox + x, oy + y, diamond ? P.rug[3] : (x + y) % 8 === 0 ? P.gold[1] : P.rug[1]);
    }
}
function rugRow(c) {
  for (let bits = 0; bits < 16; bits++) {
    const [ox, oy] = at(TROW.rug, bits);
    rugTexture(c, ox, oy, 0);
    const top = bits & 1, left = bits & 2, right = bits & 4, bottom = bits & 8;
    // floor shows around the outer pixel, then a gold trim band
    const edge = (x, y) => (top && y < 3) || (bottom && y > 12) || (left && x < 3) || (right && x > 12);
    const outer = (x, y) => (top && y < 1) || (bottom && y > 14) || (left && x < 1) || (right && x > 14);
    for (let y = 0; y < T; y++)
      for (let x = 0; x < T; x++) {
        if (outer(x, y)) c.set(ox + x, oy + y, P.floor[2]);
        else if (edge(x, y)) c.set(ox + x, oy + y, (x + y) % 3 === 0 ? P.gold[2] : P.gold[1]);
      }
    if (bottom) for (let x = 0; x < T; x++) c.set(ox + x, oy + 15, P.floor[0]);
  }
}

function interior(c) {
  // floor with edge shading against walls (bits: left1 right2 bottom4)
  for (let bits = 0; bits < 8; bits++) {
    const [ox, oy] = at(TROW.floor, bits);
    floorTexture(c, ox, oy, 400 + bits);
    for (let x = 0; x < T; x++) c.set(ox + x, oy, P.floor[0]); // shade under the back wall row above is added by wallLower; harmless
    if (bits & 1) for (let y = 0; y < T; y++) { c.set(ox, oy + y, P.black); c.set(ox + 1, oy + y, P.floor[0]); }
    if (bits & 2) for (let y = 0; y < T; y++) { c.set(ox + 15, oy + y, P.black); c.set(ox + 14, oy + y, P.floor[0]); }
    if (bits & 4) for (let x = 0; x < T; x++) { c.set(ox + x, oy + 15, P.black); c.set(ox + x, oy + 14, P.floor[1]); }
  }
  const put = (key) => at(TROW.floor, INTERIOR[key]);
  // back wall: plaster upper with a dark ceiling line, wood panelling lower
  {
    const [ox, oy] = put('wallUpper');
    plaster(c, ox, oy, 410);
    for (let x = 0; x < T; x++) { c.set(ox + x, oy, P.black); c.set(ox + x, oy + 1, P.timber[0]); c.set(ox + x, oy + 2, P.timber[2]); c.set(ox + x, oy + 3, P.shadow); }
  }
  const panel = (ox, oy) => {
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) c.set(ox + x, oy + y, y < 2 ? P.timber[3] : x % 8 === 0 ? P.timber[0] : y > 13 ? P.timber[0] : pick(P.timber, dith(x, y, 2 - (y > 8 ? 0.6 : 0))));
    for (let x = 0; x < T; x++) c.set(ox + x, oy + 15, P.black);
  };
  panel(...put('wallLower'));
  panel(...put('wallLowerPlain'));
  { const [ox, oy] = put('void'); for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) c.set(ox + x, oy + y, P.black); }
  {
    const [ox, oy] = put('doormat');
    floorTexture(c, ox, oy, 420);
    for (let y = 3; y < 13; y++) for (let x = 2; x < 14; x++) c.set(ox + x, oy + y, (x + y) % 2 ? hex('#7a8a3a') : hex('#5a6a2a'));
    for (let x = 2; x < 14; x++) { c.set(ox + x, oy + 3, hex('#9aaa5a')); c.set(ox + x, oy + 12, hex('#3a4a1a')); }
  }
  // bookshelf against the back wall (2 tall)
  {
    const shelf = new Canvas(T, 32);
    for (let y = 0; y < 32; y++) for (let x = 0; x < T; x++) shelf.set(x, y, x < 1 || x > 14 || y < 2 || y > 29 || y % 9 === 1 ? P.timber[1] : P.timber[0]);
    const r = rng(11);
    const books = ['#a83a3a', '#3a6ab0', '#3a8a4a', '#c8a030', '#7a3a8a', '#d8d0b0'].map((x) => hex(x));
    for (const top of [3, 12, 21]) {
      let x = 2;
      while (x < 14) {
        const w = 1 + Math.floor(r() * 2), h = 5 + Math.floor(r() * 3), col = books[Math.floor(r() * books.length)];
        for (let i = 0; i < w && x + i < 14; i++) for (let y = top + 7 - h; y < top + 7; y++) shelf.set(x + i, y, i === 0 ? col : [col[0] * 0.7, col[1] * 0.7, col[2] * 0.7, 255].map(Math.round));
        x += w + (r() < 0.2 ? 1 : 0);
      }
    }
    const [tx, ty] = put('shelfTop');
    const [bx, by] = put('shelfBottom');
    c.blit(shelf, tx, ty, 0, 0, T, T);
    c.blit(shelf, bx, by, 0, 16, T, T);
  }
  // window on the interior back wall
  {
    const [ox, oy] = put('windowIn');
    plaster(c, ox, oy, 430);
    for (let x = 0; x < T; x++) { c.set(ox + x, oy, P.black); c.set(ox + x, oy + 1, P.timber[0]); c.set(ox + x, oy + 2, P.timber[2]); }
    for (let y = 4; y < 14; y++) for (let x = 3; x < 13; x++) c.set(ox + x, oy + y, x === 3 || x === 12 || y === 4 || y === 13 || x === 8 ? P.timber[1] : pick(P.glass, 3 - (y - 4) * 0.25));
    c.set(ox + 5, oy + 6, P.white);
  }
}

function furniture(c) {
  const put = (key) => at(TROW.furniture, FURNITURE[key]);
  const onFloor = (key, draw, seed) => {
    const [ox, oy] = put(key);
    floorTexture(c, ox, oy, seed);
    const p = new Canvas(T, T);
    draw(p);
    outline(p);
    for (let x = 2; x < 14; x++) if (!p.get(x, 15)[3]) p.set(x, 15, P.shadow);
    c.blit(p, ox, oy);
  };
  // fireplace 2x2 against the back wall
  {
    const f = new Canvas(32, 32);
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
      const mortar = y % 5 === 4 || (x + (Math.floor(y / 5) % 2) * 4) % 8 === 0;
      f.set(x, y, mortar ? P.stone[1] : pick(P.stone, dith(x, y, 2.6 - y * 0.02)));
    }
    for (let x = 0; x < 32; x++) { f.set(x, 12, P.timber[3]); f.set(x, 13, P.timber[1]); }
    for (let y = 16; y < 31; y++) for (let x = 7; x < 25; x++) f.set(x, y, y < 18 ? P.stone[0] : P.black);
    const flames = [[12, 29, C.f0], [13, 27, C.f1], [14, 25, C.f2], [15, 23, C.f1], [16, 21, C.f0], [17, 24, C.f1], [18, 26, C.f2], [19, 28, C.f0], [16, 26, C.f2], [15, 28, C.f1]];
    for (const [x, y, col] of flames) for (let k = 0; k < 31 - y; k++) f.set(x, y + k, k < 2 ? col : C.f1);
    for (let x = 9; x < 23; x++) f.set(x, 30, P.timber[1]);
    const keys = ['fireTL', 'fireTR', 'fireBL', 'fireBR'];
    keys.forEach((k, i) => { const [ox, oy] = put(k); c.blit(f, ox, oy, (i % 2) * T, Math.floor(i / 2) * T, T, T); });
  }
  // bed: 1x2 (head at top)
  {
    const b = new Canvas(T, 32);
    for (let y = 1; y < 31; y++) for (let x = 1; x < 15; x++) {
      let col = P.timber[2];
      if (y > 2 && y < 9 && x > 2 && x < 13) col = y < 4 ? P.white : hex('#e8e4f0');
      if (y >= 10 && y < 29 && x > 1 && x < 14) col = pick(['#2a3a7a', '#3a5aa8', '#5a7ac8', '#8aa8e8'].map((h) => hex(h)), 2.5 - (x > 10 ? 1 : 0) - (y === 10 ? -1 : 0));
      if (y === 1 || y === 30) col = P.timber[1];
      b.set(x, y, col);
    }
    outline(b);
    const [tx, ty] = put('bedTop'); floorTexture(c, tx, ty, 440); c.blit(b, tx, ty, 0, 0, T, T);
    const [bx, by] = put('bedBottom'); floorTexture(c, bx, by, 441); c.blit(b, bx, by, 0, 16, T, T);
  }
  // table 2x1
  {
    const t = new Canvas(32, T);
    for (let y = 2; y < 10; y++) for (let x = 1; x < 31; x++) t.set(x, y, y === 2 ? P.floor[4] : y > 8 ? P.timber[1] : P.floor[3]);
    for (const x of [3, 4, 27, 28]) for (let y = 10; y < 15; y++) t.set(x, y, P.timber[1]);
    t.set(10, 4, P.white); t.set(11, 4, P.white); t.set(10, 5, hex('#c8c8d8')); // a cup
    t.set(20, 4, hex('#e8d8a0')); t.set(21, 4, hex('#e8d8a0')); t.set(22, 5, hex('#c8b880')); // a letter
    outline(t);
    const [lx, ly] = put('tableL'); floorTexture(c, lx, ly, 450); c.blit(t, lx, ly, 0, 0, T, T);
    const [rx, ry] = put('tableR'); floorTexture(c, rx, ry, 451); c.blit(t, rx, ry, 16, 0, T, T);
  }
  onFloor('chair', (p) => { for (let y = 2; y < 14; y++) for (let x = 4; x < 12; x++) p.set(x, y, y < 7 ? P.timber[y === 2 ? 3 : 2] : y < 9 ? P.floor[3] : x === 4 || x === 11 ? P.timber[1] : null); }, 460);
  onFloor('barrel', (p) => { for (let y = 2; y < 15; y++) for (let x = 3; x < 13; x++) { const b = y > 3 && y < 13 ? 0 : 1; if (x < 3 + b || x > 12 - b) continue; p.set(x, y, y === 4 || y === 11 ? P.stone[2] : y === 2 ? P.timber[1] : x < 6 ? P.timber[3] : x > 10 ? P.timber[1] : P.timber[2]); } }, 461);
  onFloor('crate', (p) => { for (let y = 3; y < 15; y++) for (let x = 2; x < 14; x++) p.set(x, y, y < 6 ? P.timber[3] : x === 2 || x === 13 || y === 14 || x - 2 === y - 3 ? P.timber[1] : P.timber[2]); }, 462);
  onFloor('pot', (p) => {
    for (let y = 8; y < 15; y++) for (let x = 4; x < 12; x++) p.set(x, y, x < 6 ? hex('#d07a4a') : hex('#a85a32'));
    const n = valueNoise(3, 4);
    for (let y = 1; y < 9; y++) for (let x = 2; x < 14; x++) if (((x - 7.5) / 6) ** 2 + ((y - 5) / 4) ** 2 < 1 + (n(x / 2, y / 2) - 0.5) * 0.5) p.set(x, y, pick(P.leaf, 2.5 - (x - 7) * 0.2 - (y - 4) * 0.2));
  }, 463);
  onFloor('chest', (p) => {
    for (let y = 4; y < 15; y++) for (let x = 2; x < 14; x++) p.set(x, y, y < 8 ? P.timber[3] : P.timber[2]);
    for (let x = 2; x < 14; x++) p.set(x, 8, P.gold[1]);
    for (let y = 4; y < 15; y++) { p.set(4, y, P.gold[0]); p.set(11, y, P.gold[0]); }
    p.set(7, 8, P.gold[2]); p.set(8, 8, P.gold[2]); p.set(7, 9, P.gold[0]); p.set(8, 9, P.gold[0]);
  }, 464);
  onFloor('stool', (p) => { for (let y = 6; y < 14; y++) for (let x = 4; x < 12; x++) p.set(x, y, y < 9 ? P.timber[3] : x === 4 || x === 11 ? P.timber[1] : null); }, 465);
}

export function buildTown(c) {
  roofRow(c);
  wallRow(c);
  blendRow(c, TROW.cobble, cobbleTexture, C.g0, P.stone[4]);
  fenceRow(c);
  townMisc(c);
  interior(c);
  rugRow(c);
  furniture(c);
}

export function townCollidingTiles() {
  const ids = [];
  for (let b = 0; b < 16; b++) ids.push(idx(TROW.roof, b), idx(TROW.wall, b), idx(TROW.fence, b));
  for (const k of ['window', 'doorTop', 'hedge', 'wellBase', 'lampBase', 'crate', 'flowerbed', 'chimney']) ids.push(idx(TROW.town, TOWN[k]));
  for (const k of ['wallUpper', 'wallLower', 'void', 'shelfTop', 'shelfBottom', 'windowIn', 'wallLowerPlain']) ids.push(idx(TROW.floor, INTERIOR[k]));
  for (const k of Object.keys(FURNITURE)) ids.push(idx(TROW.furniture, FURNITURE[k]));
  return ids;
}
