// Interactive object sprites (16x16 frames): 0 chest closed, 1 chest open, 2 signpost.
import { Canvas, hex } from './lib.mjs';
import { outline } from './tiles.mjs';

const wood = ['#3a200e', '#6a3e1c', '#9a5e2c', '#c88a46'].map((x) => hex(x));
const gold = ['#7a5a10', '#c8a030', '#f8e070'].map((x) => hex(x));
const shadow = hex('#000000', 80);

function chest(open) {
  const p = new Canvas(16, 16);
  // body
  for (let y = 8; y < 15; y++) for (let x = 2; x < 14; x++) p.set(x, y, x < 4 ? wood[3] : x > 11 ? wood[1] : wood[2]);
  for (let x = 2; x < 14; x++) p.set(x, 14, wood[1]);
  if (open) {
    // lid tipped back, dark inside with a glint of treasure
    for (let y = 1; y < 5; y++) for (let x = 2; x < 14; x++) p.set(x, y, y === 1 ? wood[3] : wood[2]);
    for (let y = 5; y < 9; y++) for (let x = 3; x < 13; x++) p.set(x, y, hex('#1a0e08'));
    p.set(6, 7, gold[2]); p.set(9, 6, gold[1]);
  } else {
    for (let y = 3; y < 8; y++) for (let x = 2; x < 14; x++) p.set(x, y, y === 3 ? wood[3] : y < 6 ? wood[2] : wood[1]);
  }
  // metal bands and lock
  for (let y = open ? 1 : 3; y < 15; y++) { p.set(4, y, gold[0]); p.set(11, y, gold[0]); }
  for (let x = 2; x < 14; x++) p.set(x, 8, gold[1]);
  if (!open) { p.set(7, 8, gold[2]); p.set(8, 8, gold[2]); p.set(7, 9, gold[0]); p.set(8, 9, gold[0]); }
  outline(p);
  for (let x = 2; x < 14; x++) if (!p.get(x, 15)[3]) p.set(x, 15, shadow);
  return p;
}

function sign() {
  const p = new Canvas(16, 16);
  for (let y = 9; y < 15; y++) { p.set(7, y, wood[2]); p.set(8, y, wood[1]); }
  for (let y = 2; y < 9; y++) for (let x = 1; x < 15; x++) p.set(x, y, y === 2 ? wood[3] : x === 1 || x === 14 || y === 8 ? wood[1] : wood[2]);
  for (const y of [4, 6]) for (let x = 3; x < (y === 4 ? 13 : 10); x++) p.set(x, y, wood[0]);
  outline(p);
  for (let x = 5; x < 11; x++) if (!p.get(x, 15)[3]) p.set(x, 15, shadow);
  return p;
}

export function buildProps() {
  const c = new Canvas(48, 16);
  [chest(false), chest(true), sign()].forEach((p, i) => c.blit(p, i * 16, 0));
  return c;
}
