// The "art demo" field map: ASCII layout → Tiled JSON using the field tileset.
const LAYOUT = [
  '^^^^^^^^^^^^^^^^^^^^',
  '^^^^^^^^^^^^^^^^^^^^',
  '#######D############',
  '#####i#d#i##########',
  '..T...b.....B..r..T.',
  '.......=..*......,..',
  '.r...===.....T......',
  '....==..,..........B',
  '...==..........~~~..',
  'b..=....s.....~~~~~.',
  '...==.*......~~~~~~.',
  '....=====.....~~~~..',
  '.B......====.....*..',
  '....,.......===.....',
];

export function buildArtDemoMap({ collides, columns, rows, MISC, ROW, tileIndex }) {
  const H = LAYOUT.length, W = LAYOUT[0].length;
  const cell = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? null : LAYOUT[y][x]);
  // Corner terrain: a vertex takes a terrain if at least 2 of its 4 neighbouring cells have it.
  const vertex = (vx, vy, ch) => [cell(vx - 1, vy - 1), cell(vx, vy - 1), cell(vx - 1, vy), cell(vx, vy)].filter((c) => c === ch).length >= 2;
  const corners = (x, y, ch) => (vertex(x, y, ch) ? 1 : 0) | (vertex(x + 1, y, ch) ? 2 : 0) | (vertex(x, y + 1, ch) ? 4 : 0) | (vertex(x + 1, y + 1, ch) ? 8 : 0);
  const isFace = (c) => c === '#' || c === 'i' || c === 'D' || c === 'd';

  const ground = [], above = new Array(W * H).fill(0);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const ch = cell(x, y);
      const water = corners(x, y, '~');
      const path = corners(x, y, '=');
      const hash = (x * 73856093) ^ (y * 19349663);
      let t = water ? tileIndex(ROW.water, water) : tileIndex(ROW.path, path);
      if (!water && path === 0) t = tileIndex(ROW.variants, Math.abs(hash) % 6);
      if (!water && path === 15) t = tileIndex(ROW.variants, 6 + (Math.abs(hash) % 3));
      if (ch === '^') t = tileIndex(ROW.variants, Math.abs(hash) % 6);
      if (ch === '#' || ch === 'i') {
        const bits = (isFace(cell(x, y - 1)) ? 0 : 1) | (isFace(cell(x - 1, y)) || cell(x - 1, y) === null ? 0 : 2) |
          (isFace(cell(x + 1, y)) || cell(x + 1, y) === null ? 0 : 4) | (isFace(cell(x, y + 1)) ? 0 : 8);
        t = tileIndex(ROW.cliff, bits);
      }
      if (ch === 'D') t = tileIndex(ROW.misc, MISC.doorTop);
      if (ch === 'd') t = tileIndex(ROW.misc, MISC.doorBottom);
      const pureGrass = !water && path === 0;
      if (ch === ',' && pureGrass) t = tileIndex(ROW.misc, MISC.grassB);
      if (ch === '*' && pureGrass) t = tileIndex(ROW.misc, MISC.flowers);
      if (ch === 'b') t = tileIndex(ROW.misc, MISC.barrel);
      if (ch === 'r') t = tileIndex(ROW.misc, MISC.rock);
      if (ch === 'B') t = tileIndex(ROW.misc, MISC.bush);
      if (ch === 's') t = tileIndex(ROW.misc, MISC.stump);
      ground.push(t + 1);
    }
  const setG = (x, y, t) => (ground[y * W + x] = t + 1);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const ch = cell(x, y);
      if (ch === 'T') {
        // tree: canopy top in the "above" layer, trunk row blocks movement
        above[y * W + x] = tileIndex(ROW.misc, MISC.treeTL) + 1;
        above[y * W + x + 1] = tileIndex(ROW.misc, MISC.treeTR) + 1;
        setG(x, y + 1, tileIndex(ROW.misc, MISC.treeBL));
        setG(x + 1, y + 1, tileIndex(ROW.misc, MISC.treeBR));
      }
      if (ch === 'i') {
        // torch stands on the ground in front of the cliff: flame tile above it
        setG(x, y + 1, tileIndex(ROW.misc, MISC.torchBottom));
        above[y * W + x] = tileIndex(ROW.misc, MISC.torchTop) + 1;
      }
    }

  const prop = (name, value) => ({ name, type: typeof value === 'string' ? 'string' : 'int', value });
  const objects = [
    { id: 1, name: 'start', type: 'spawn', x: 7 * 16, y: 6 * 16, width: 16, height: 16, rotation: 0, visible: true, properties: [prop('facing', 'down')] },
    { id: 2, name: 'tobin', type: 'npc', x: 9 * 16, y: 7 * 16, width: 16, height: 16, rotation: 0, visible: true, properties: [prop('npc', 'tobin')] },
    { id: 3, name: 'door', type: 'sign', x: 8 * 16, y: 4 * 16, width: 16, height: 16, rotation: 0, visible: true, properties: [prop('dialogue', 'art_demo.door'), { name: 'hidden', type: 'bool', value: true }] },
  ];
  const layer = (id, name, data) => ({ id, name, type: 'tilelayer', width: W, height: H, x: 0, y: 0, opacity: 1, visible: true, data });
  return {
    compressionlevel: -1, width: W, height: H, infinite: false, orientation: 'orthogonal', renderorder: 'right-down',
    tiledversion: '1.10.2', tilewidth: 16, tileheight: 16, type: 'map', version: '1.10', nextlayerid: 4, nextobjectid: 4,
    properties: [{ name: 'displayName', type: 'string', value: 'Art Demo' }],
    layers: [layer(1, 'ground', ground), layer(2, 'above', above),
      { id: 3, name: 'objects', type: 'objectgroup', draworder: 'topdown', opacity: 1, visible: true, x: 0, y: 0, objects }],
    tilesets: [{
      firstgid: 1, name: 'field', image: '../tilesets/field.png', imagewidth: columns * 16, imageheight: rows * 16,
      columns, tilecount: columns * rows, tilewidth: 16, tileheight: 16, margin: 0, spacing: 0,
      tiles: collides.map((id) => ({ id, properties: [{ name: 'collides', type: 'bool', value: true }] })),
    }],
  };
}
