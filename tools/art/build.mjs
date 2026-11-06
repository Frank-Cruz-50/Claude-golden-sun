// Regenerates all code-drawn art into /assets. Run: node tools/art/build.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSheet } from './sheet.mjs';
import * as wren from './wren.mjs';
import * as tobin from './tobin.mjs';
import { beekeeper, jun, maelis, miller, watchman } from './cast.mjs';
import { buildProps } from './props.mjs';
import { buildFontSheet, buildFontXml } from './font.mjs';
import { Canvas } from './lib.mjs';
import { drawWindow } from './battle.mjs';
import { buildTileset, collidingTiles } from './tiles.mjs';
import { configureTileset } from './mapgen.mjs';
import { artDemo, brindlewick, cottage } from './maps.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = (p) => {
  const full = join(root, p);
  mkdirSync(dirname(full), { recursive: true });
  return full;
};

const tileset = buildTileset();
tileset.save(out('assets/tilesets/field.png'));
for (const [name, def] of Object.entries({ wren, tobin, jun, maelis, miller, beekeeper, watchman }))
  buildSheet(def).save(out(`assets/sprites/${name}.png`));
buildProps().save(out('assets/ui/props.png'));
const font = buildFontSheet();
font.sheet.save(out('assets/ui/font.png'));
writeFileSync(out('assets/ui/font.xml'), buildFontXml(font));
// dialogue box (exact size) and a small 9-slice window for tags and menus
const box = new Canvas(232, 50);
drawWindow(box, 0, 0, 232, 50);
box.save(out('assets/ui/textbox.png'));
const win9 = new Canvas(16, 16);
drawWindow(win9, 0, 0, 16, 16);
win9.save(out('assets/ui/window9.png'));
configureTileset({ rows: tileset.h / 16, collides: collidingTiles() });
for (const build of [artDemo, brindlewick, cottage]) {
  const { file, map } = build();
  writeFileSync(out(`assets/maps/${file}`), JSON.stringify(map, null, 1));
}
console.log('art built');
