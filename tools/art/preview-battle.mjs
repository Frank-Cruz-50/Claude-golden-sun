import { Canvas, hex } from './lib.mjs';
import { forestBackground, bristleback, drawWindow, cursor } from './battle.mjs';
import { buildSheet } from './sheet.mjs';
import * as wren from './wren.mjs';
import * as tobin from './tobin.mjs';
import { drawText, textWidth } from './font.mjs';

const c = new Canvas(240, 160);
c.blit(forestBackground(), 0, 0);
const shadow = (x, y, rx) => { for (let j = -2; j <= 2; j++) for (let i = -rx; i <= rx; i++) if ((i * i) / (rx * rx) + (j * j) / 5 <= 1) c.set(x + i, y + j, hex('#000000', 80)); };
shadow(58, 104, 32);
c.blit(bristleback(), 12, 46);
const party = [[wren, 174, 56], [tobin, 192, 76]];
for (const [def, x, y] of party) {
  shadow(x + 12, y + 31, 7);
  c.blit(buildSheet(def), x, y, 0, 32, 24, 32); // left-facing stand
}
// Bottom windows
drawWindow(c, 0, 112, 90, 48);
drawWindow(c, 90, 112, 150, 48);
const white = hex('#ffffff'), yellow = hex('#ffe060'), grey = hex('#a8a8d0');
const cmds = [['Attack', 'Spirit'], ['Ability', 'Summon'], ['Item', 'Defend']];
cmds.forEach(([a, b], i) => { drawText(c, a, 15, 118 + i * 13, white); drawText(c, b, 51, 118 + i * 13, white); });
c.blit(cursor(), 4, 119);
const rows = [['Wren', 42, 42, 18, true], ['Tobin', 35, 38, 24, false]];
drawText(c, 'HP', 152, 117, grey); drawText(c, 'PP', 206, 117, grey);
rows.forEach(([name, hp, max, pp, active], i) => {
  const y = 127 + i * 13;
  drawText(c, name, 98, y, active ? yellow : white);
  const hpStr = `${hp}/${max}`;
  drawText(c, hpStr, 186 - textWidth(hpStr), y, white);
  drawText(c, String(pp), 222 - textWidth(String(pp)), y, white);
  // HP bar
  for (let k = 0; k < 40; k++) c.set(146 + k, y + 9, k < (40 * hp) / max ? hex('#60e070') : hex('#203020'));
});
// Active-turn marker above Wren
for (const [dx, dy] of [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [1, 1], [2, 1], [3, 1], [2, 2]]) c.set(184 + dx, 50 + dy, yellow);
c.scaled(4).save(process.argv[2]);
