import { Canvas, hex } from './lib.mjs';
import { buildSheet } from './sheet.mjs';
const def = await import(`./${process.argv[3] ?? 'wren'}.mjs`);
const s = buildSheet(def);
const out = new Canvas(s.w + 8, s.h + 8);
out.rect(0, 0, out.w, out.h, hex('#4a9a2e'));
out.blit(s, 4, 4);
out.scaled(5).save(process.argv[2]);
