// Composites the art demo map + characters into a PNG for quick review.
import { readFileSync } from 'node:fs';
import { Canvas, hex } from './lib.mjs';
import { buildTileset } from './tiles.mjs';
import { characterSheet, PALETTES } from './characters.mjs';
const map = JSON.parse(readFileSync(new URL('../../assets/maps/art_demo.tmj', import.meta.url)));
const ts = buildTileset();
const c = new Canvas(map.width * 16, map.height * 16);
const draw = (layer) => layer.data.forEach((gid, i) => {
  if (!gid) return;
  const t = gid - 1;
  c.blit(ts, (i % map.width) * 16, Math.floor(i / map.width) * 16, (t % 16) * 16, Math.floor(t / 16) * 16, 16, 16);
});
draw(map.layers[0]);
const shadow = (x, y) => { for (let j = -2; j <= 2; j++) for (let i = -6; i <= 6; i++) if ((i * i) / 36 + (j * j) / 5 <= 1) c.set(x + i, y + j, hex('#000000', 80)); };
const chars = [[PALETTES.wren, 7, 6, 0], [PALETTES.tobin, 9, 7, 1]];
for (const [pal, tx, ty, row] of chars) {
  shadow(tx * 16 + 8, ty * 16 + 14);
  c.blit(characterSheet(pal), tx * 16, ty * 16 - 8, 0, row * 24, 16, 24);
}
draw(map.layers[1]);
const view = new Canvas(240, 160);
view.blit(c, 0, 0, 40, 16, 240, 160);
view.scaled(4).save(process.argv[2]);
