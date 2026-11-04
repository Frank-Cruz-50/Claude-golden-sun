// Side-by-side close-up of character sheets for review.
import { Canvas, hex } from './lib.mjs';
import { buildSheet } from './sheet.mjs';
import * as wren from './wren.mjs';
import * as tobin from './tobin.mjs';
const sheets = [wren, tobin].map(buildSheet);
const out = new Canvas(sheets.length * 80 + 8, 136);
out.rect(0, 0, out.w, out.h, hex('#4a9a2e'));
sheets.forEach((s, i) => out.blit(s, 4 + i * 80, 4));
out.scaled(4).save(process.argv[2]);
