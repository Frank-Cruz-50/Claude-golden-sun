// Side-by-side close-up of character sheets for review.
import { Canvas, hex } from './lib.mjs';
import { buildBattleFrame, buildSheet } from './sheet.mjs';
import * as wren from './wren.mjs';
import * as tobin from './tobin.mjs';
const defs = [wren, tobin];
const sheets = defs.map(buildSheet);
const out = new Canvas(defs.length * 80 + 8, 176);
out.rect(0, 0, out.w, out.h, hex('#4a9a2e'));
sheets.forEach((s, i) => out.blit(s, 4 + i * 80, 4));
defs.forEach((d, i) => out.blit(buildBattleFrame(d), 24 + i * 80, 138));
out.scaled(4).save(process.argv[2]);
