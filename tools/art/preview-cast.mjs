// Close-up of every character sheet for review: node preview-cast.mjs out.png
import { Canvas, hex } from './lib.mjs';
import { buildBattleFrame, buildSheet } from './sheet.mjs';
import * as wren from './wren.mjs';
import * as tobin from './tobin.mjs';
import { beekeeper, jun, maelis, miller, watchman } from './cast.mjs';
const defs = [wren, tobin, jun, maelis, miller, beekeeper, watchman];
const out = new Canvas(defs.length * 80 + 8, 176);
out.rect(0, 0, out.w, out.h, hex('#4a9a2e'));
defs.forEach((d, i) => {
  out.blit(buildSheet(d), 4 + i * 80, 4);
  if (d.frame.length === 0 || d.battleFrame) out.blit(buildBattleFrame(d), 24 + i * 80, 138);
});
out.scaled(3).save(process.argv[2]);
