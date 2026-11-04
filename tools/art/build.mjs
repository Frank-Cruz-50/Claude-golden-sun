// Regenerates all code-drawn art into /assets. Run: node tools/art/build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSheet } from './sheet.mjs';
import * as wren from './wren.mjs';
import * as tobin from './tobin.mjs';
import { buildTileset, collidingTiles, COLS, MISC, ROW, tileIndex } from './tiles.mjs';
import { buildArtDemoMap } from './demo-map.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = (p) => {
  const full = join(root, p);
  mkdirSync(dirname(full), { recursive: true });
  return full;
};

const tileset = buildTileset();
tileset.save(out('assets/tilesets/field.png'));
for (const [name, def] of Object.entries({ wren, tobin })) buildSheet(def).save(out(`assets/sprites/${name}.png`));
const map = buildArtDemoMap({ collides: collidingTiles(), columns: COLS, rows: tileset.h / 16, MISC, ROW, tileIndex });
writeFileSync(out('assets/maps/art_demo.tmj'), JSON.stringify(map, null, 1));
console.log('art built');
