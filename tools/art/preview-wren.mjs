import { Canvas, hex } from './lib.mjs';
import { renderFront } from './wren.mjs';
import { characterSheet, PALETTES } from './characters.mjs';
const out = new Canvas(100, 40);
out.rect(0, 0, 100, 40, hex('#4a9a2e'));
['stand', 'stepA', 'stepB'].forEach((l, i) => out.blit(renderFront(l), 4 + i * 28, 4));
out.blit(characterSheet(PALETTES.wren), 86, 12, 0, 0, 16, 24);
out.scaled(8).save(process.argv[2]);
