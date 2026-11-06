// Renders a whole map (both tile layers) to a PNG: node preview-full.mjs <map.tmj> <out.png> [scale]
import { readFileSync } from 'node:fs';
import { Canvas } from './lib.mjs';
import { buildTileset } from './tiles.mjs';
const [file, outPath, scale = '3'] = process.argv.slice(2);
const map = JSON.parse(readFileSync(file));
const ts = buildTileset();
const c = new Canvas(map.width * 16, map.height * 16);
for (const layer of map.layers.filter((l) => l.type === 'tilelayer'))
  layer.data.forEach((gid, i) => {
    if (!gid) return;
    const t = gid - 1;
    c.blit(ts, (i % map.width) * 16, Math.floor(i / map.width) * 16, (t % 16) * 16, Math.floor(t / 16) * 16, 16, 16);
  });
c.scaled(Number(scale)).save(outPath);
