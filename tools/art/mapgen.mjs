// Map builder: paint a character grid with helpers, then convert it to a Tiled .tmj
// using the field tileset. Legend (one char per cell):
//   terrain  . grass  , grass alt  * flowers  = path  S cobble  ~ water  ^ plateau
//   cliff    # face  Q/q cliff door top/bottom  i torch (in the face row)
//   town     R roof  C chimney  W wall  w window  H house door (wall above becomes the door top)
//            F fence  h hedge  O well  B bridge  L lamp  x crate  f flowerbed  o stepping stones
//   nature   T tree (2x2, this cell = top-left)  b barrel  r rock  u bush  s stump
//   interior ' ' void  X back wall  K bookshelf  P fireplace (2x2)  N window  _ floor  g rug
//            M doormat  E bed (2 tall)  t table (2 wide)  c chair  n stool  p pot
import { COLS, MISC, ROW, tileIndex } from './tiles.mjs';
import { FURNITURE, INTERIOR, TOWN, TROW } from './town.mjs';

export class Grid {
  constructor(w, h, fill = '.') {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => Array(w).fill(fill));
  }
  get(x, y) {
    return x < 0 || y < 0 || x >= this.w || y >= this.h ? null : this.cells[y][x];
  }
  set(x, y, ch) {
    if (this.get(x, y) !== null) this.cells[y][x] = ch;
    return this;
  }
  rect(x0, y0, x1, y1, ch) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) this.set(x, y, ch);
    return this;
  }
  /** Outline of a rectangle (e.g. a fence), with optional gap cells [[x,y],...]. */
  frame(x0, y0, x1, y1, ch, gaps = []) {
    for (let x = x0; x <= x1; x++) this.set(x, y0, ch).set(x, y1, ch);
    for (let y = y0; y <= y1; y++) this.set(x0, y, ch).set(x1, y, ch);
    for (const [x, y] of gaps) this.set(x, y, '.');
    return this;
  }
  ellipse(cx, cy, rx, ry, ch) {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++)
      for (let x = Math.floor(cx - rx); x <= cx + rx; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) this.set(x, y, ch);
    return this;
  }
  /** A house: roof rows on top, two wall rows, a door and windows (x offsets from x0). */
  house(x0, y0, w, { roof = 2, door = 1, windows = [], chimney = null } = {}) {
    this.rect(x0, y0, x0 + w - 1, y0 + roof - 1, 'R');
    if (chimney !== null) this.set(x0 + chimney, y0, 'C');
    this.rect(x0, y0 + roof, x0 + w - 1, y0 + roof + 1, 'W');
    for (const wx of windows) this.set(x0 + wx, y0 + roof, 'w');
    this.set(x0 + door, y0 + roof + 1, 'H');
    return { door: [x0 + door, y0 + roof + 1] };
  }
  rows() {
    return this.cells.map((r) => r.join(''));
  }
}

const ROOFISH = new Set(['R', 'C']);
const WALLISH = new Set(['W', 'w', 'H']);
const FACE = new Set(['#', 'Q', 'q', 'i']);
const OPAQUE_INTERIOR = new Set([' ', 'X', 'K', 'P', 'N']);

export function buildMap({ grid, name, objects, interior = false }) {
  const W = grid.w, H = grid.h;
  const cell = (x, y) => grid.get(x, y);
  const vertexHas = (vx, vy, set) => [cell(vx - 1, vy - 1), cell(vx, vy - 1), cell(vx - 1, vy), cell(vx, vy)].filter((c) => set.has(c)).length >= 2;
  const corners = (x, y, set) => (vertexHas(x, y, set) ? 1 : 0) | (vertexHas(x + 1, y, set) ? 2 : 0) | (vertexHas(x, y + 1, set) ? 4 : 0) | (vertexHas(x + 1, y + 1, set) ? 8 : 0);
  const hash = (x, y) => Math.abs((x * 73856093) ^ (y * 19349663));
  const WATER = new Set(['~', 'B']), COBBLE = new Set(['S', 'O']), PATH = new Set(['=', 'H', 'o']);

  const ground = new Array(W * H).fill(0), above = new Array(W * H).fill(0);
  const G = (x, y, t) => (ground[y * W + x] = t + 1);
  const A = (x, y, t) => { if (x >= 0 && y >= 0 && x < W && y < H) above[y * W + x] = t + 1; };
  const T = (row, col) => tileIndex(row, col);

  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const ch = cell(x, y);
      let t;
      if (interior) {
        if (ch === 'g') {
          const r = (dx, dy) => cell(x + dx, y + dy) === 'g';
          t = T(TROW.rug, (r(0, -1) ? 0 : 1) | (r(-1, 0) ? 0 : 2) | (r(1, 0) ? 0 : 4) | (r(0, 1) ? 0 : 8));
        } else {
          const bits = (OPAQUE_INTERIOR.has(cell(x - 1, y)) ? 1 : 0) | (OPAQUE_INTERIOR.has(cell(x + 1, y)) ? 2 : 0) | (cell(x, y + 1) === ' ' || cell(x, y + 1) === null ? 4 : 0);
          t = T(TROW.floor, bits);
        }
      } else {
        const water = corners(x, y, WATER), cobble = corners(x, y, COBBLE), path = corners(x, y, PATH);
        if (water) t = T(ROW.water, water);
        else if (cobble) t = cobble === 15 ? T(TROW.cobble, 15) : T(TROW.cobble, cobble);
        else if (path) t = path === 15 ? T(ROW.variants, 6 + (hash(x, y) % 3)) : T(ROW.path, path);
        else t = T(ROW.variants, hash(x, y) % 6);
      }
      const pureGrass = t >= T(ROW.variants, 0) && t <= T(ROW.variants, 5);
      switch (ch) {
        case ',': if (pureGrass) t = T(ROW.misc, MISC.grassB); break;
        case '*': if (pureGrass) t = T(ROW.misc, MISC.flowers); break;
        case '^': t = T(ROW.variants, hash(x, y) % 6); break;
        case '#': case 'i': {
          const bits = (FACE.has(cell(x, y - 1)) ? 0 : 1) | (FACE.has(cell(x - 1, y)) || cell(x - 1, y) === null ? 0 : 2) |
            (FACE.has(cell(x + 1, y)) || cell(x + 1, y) === null ? 0 : 4) | (FACE.has(cell(x, y + 1)) ? 0 : 8);
          t = T(ROW.cliff, bits);
          if (ch === 'i') { G(x, y, t); A(x, y, T(ROW.misc, MISC.torchTop)); }
          break;
        }
        case 'Q': t = T(ROW.misc, MISC.doorTop); break;
        case 'q': t = T(ROW.misc, MISC.doorBottom); break;
        case 'R': case 'C': {
          const bits = (ROOFISH.has(cell(x, y - 1)) ? 0 : 1) | (ROOFISH.has(cell(x - 1, y)) ? 0 : 2) | (ROOFISH.has(cell(x + 1, y)) ? 0 : 4) | (ROOFISH.has(cell(x, y + 1)) ? 0 : 8);
          t = ch === 'C' ? T(TROW.town, TOWN.chimney) : T(TROW.roof, bits);
          break;
        }
        case 'W': {
          if (cell(x, y + 1) === 'H') { t = T(TROW.town, TOWN.doorTop); break; }
          const bits = (WALLISH.has(cell(x - 1, y)) ? 0 : 1) | (WALLISH.has(cell(x + 1, y)) ? 0 : 2) | (ROOFISH.has(cell(x, y - 1)) ? 4 : 0) | (WALLISH.has(cell(x, y + 1)) ? 0 : 8);
          t = T(TROW.wall, bits);
          break;
        }
        case 'w': t = T(TROW.town, TOWN.window); break;
        case 'H': t = T(TROW.town, TOWN.doorBottom); break;
        case 'F': {
          const f = (dx, dy) => cell(x + dx, y + dy) === 'F';
          t = T(TROW.fence, (f(-1, 0) ? 1 : 0) | (f(1, 0) ? 2 : 0) | (f(0, -1) ? 4 : 0) | (f(0, 1) ? 8 : 0));
          break;
        }
        case 'h': t = T(TROW.town, TOWN.hedge); break;
        case 'O': t = T(TROW.town, TOWN.wellBase); A(x, y - 1, T(TROW.town, TOWN.wellRoof)); break;
        case 'B': t = T(TROW.town, TOWN.bridge); break;
        case 'L': t = T(TROW.town, TOWN.lampBase); A(x, y - 1, T(TROW.town, TOWN.lampTop)); break;
        case 'f': t = T(TROW.town, TOWN.flowerbed); break;
        case 'o': t = T(TROW.town, TOWN.pathStone); break;
        case 'x': t = interior ? T(TROW.furniture, FURNITURE.crate) : T(TROW.town, TOWN.crate); break;
        case 'b': t = interior ? T(TROW.furniture, FURNITURE.barrel) : T(ROW.misc, MISC.barrel); break;
        case 'r': t = T(ROW.misc, MISC.rock); break;
        case 'u': t = T(ROW.misc, MISC.bush); break;
        case 's': t = T(ROW.misc, MISC.stump); break;
        // interior
        case ' ': t = T(TROW.floor, INTERIOR.void); break;
        case 'X': case 'K': case 'N': {
          const upper = cell(x, y - 1) === ' ' || cell(x, y - 1) === null;
          if (ch === 'K') t = T(TROW.floor, upper ? INTERIOR.shelfTop : INTERIOR.shelfBottom);
          else if (ch === 'N' && upper) t = T(TROW.floor, INTERIOR.windowIn);
          else t = T(TROW.floor, upper ? INTERIOR.wallUpper : INTERIOR.wallLower);
          break;
        }
        case 'P': {
          const left = cell(x - 1, y) !== 'P', top = cell(x, y - 1) !== 'P';
          t = T(TROW.furniture, top ? (left ? FURNITURE.fireTL : FURNITURE.fireTR) : left ? FURNITURE.fireBL : FURNITURE.fireBR);
          break;
        }
        case 'M': t = T(TROW.floor, INTERIOR.doormat); break;
        case 'E': t = T(TROW.furniture, cell(x, y - 1) === 'E' ? FURNITURE.bedBottom : FURNITURE.bedTop); break;
        case 't': t = T(TROW.furniture, cell(x - 1, y) === 't' ? FURNITURE.tableR : FURNITURE.tableL); break;
        case 'c': t = T(TROW.furniture, FURNITURE.chair); break;
        case 'n': t = T(TROW.furniture, FURNITURE.stool); break;
        case 'p': t = T(TROW.furniture, FURNITURE.pot); break;
      }
      G(x, y, t);
    }
  // trees: canopy top in the above layer, trunk row blocks
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (cell(x, y) === 'T') {
        A(x, y, T(ROW.misc, MISC.treeTL));
        A(x + 1, y, T(ROW.misc, MISC.treeTR));
        if (y + 1 < H) { G(x, y + 1, T(ROW.misc, MISC.treeBL)); if (x + 1 < W) G(x + 1, y + 1, T(ROW.misc, MISC.treeBR)); }
      }
  return toTmj(W, H, name, ground, above, objects);
}

function prop(name, value) {
  return { name, type: typeof value === 'boolean' ? 'bool' : typeof value === 'number' ? 'int' : 'string', value };
}

/** objects: [type, name, x, y, props] in tile coordinates. */
function toTmj(W, H, displayName, ground, above, objects, collides = globalThis.__collides) {
  let id = 1;
  const objs = objects.map(([type, name, x, y, props = {}]) => ({
    id: id++, name, type, x: x * 16, y: y * 16, width: 16, height: 16, rotation: 0, visible: true,
    properties: Object.entries(props).map(([k, v]) => prop(k, v)),
  }));
  const layer = (lid, name, data) => ({ id: lid, name, type: 'tilelayer', width: W, height: H, x: 0, y: 0, opacity: 1, visible: true, data });
  return {
    compressionlevel: -1, width: W, height: H, infinite: false, orientation: 'orthogonal', renderorder: 'right-down',
    tiledversion: '1.10.2', tilewidth: 16, tileheight: 16, type: 'map', version: '1.10', nextlayerid: 4, nextobjectid: id,
    properties: [prop('displayName', displayName)],
    layers: [layer(1, 'ground', ground), layer(2, 'above', above),
      { id: 3, name: 'objects', type: 'objectgroup', draworder: 'topdown', opacity: 1, visible: true, x: 0, y: 0, objects: objs }],
    tilesets: [{
      firstgid: 1, name: 'field', image: '../tilesets/field.png', imagewidth: COLS * 16, imageheight: tilesetRows() * 16,
      columns: COLS, tilecount: COLS * tilesetRows(), tilewidth: 16, tileheight: 16, margin: 0, spacing: 0,
      tiles: collides.map((tid) => ({ id: tid, properties: [prop('collides', true)] })),
    }],
  };
}

let rowsCache = 0;
const tilesetRows = () => rowsCache;
export function configureTileset({ rows, collides }) {
  rowsCache = rows;
  globalThis.__collides = collides;
}
