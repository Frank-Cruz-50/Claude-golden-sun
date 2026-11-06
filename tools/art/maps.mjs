// Map layouts. Each returns { file, map }.
import { buildMap, Grid } from './mapgen.mjs';

export function brindlewick() {
  const g = new Grid(32, 24);
  // border: trees along top and bottom, hedges down the sides
  for (let x = 0; x < 32; x += 2) if (x !== 14) g.set(x, 0, 'T');
  g.set(14, 0, 'h').set(14, 1, 'h');
  for (let x = 0; x < 32; x += 2) g.set(x, 22, 'T');
  for (let y = 2; y < 22; y++) g.set(0, y, 'h').set(31, y, 'h');
  // north road out of town (blocked by the watchman tonight)
  g.rect(15, 0, 15, 8, '=');
  // houses
  const hesper = g.house(3, 3, 6, { windows: [1, 4], door: 2, chimney: 4 });
  const locked = g.house(21, 3, 6, { windows: [1, 4], door: 3, chimney: 1 });
  const mill = g.house(24, 10, 5, { windows: [1, 3], door: 2 });
  // roads
  g.rect(hesper.door[0], 7, hesper.door[0], 8, '=');
  g.rect(locked.door[0], 7, locked.door[0], 8, '=');
  g.rect(5, 8, 24, 8, '=');
  g.rect(mill.door[0], 14, mill.door[0], 15, '=');
  g.rect(15, 15, mill.door[0], 15, '=');
  // cobbled plaza with the well
  g.rect(12, 9, 18, 13, 'S');
  g.set(15, 11, 'O');
  g.set(11, 9, 'L').set(19, 9, 'L');
  // south path to the pond bridge
  g.rect(15, 14, 15, 18, '=');
  g.rect(15, 18, 20, 18, '=');
  g.ellipse(24, 18, 3.6, 2.6, '~');
  g.rect(21, 18, 27, 18, 'B');
  g.rect(27, 17, 29, 19, '=');
  // garden with a fence, flowerbeds, and a gap at the bottom
  g.frame(2, 14, 9, 20, 'F', [[6, 20]]);
  g.rect(4, 17, 5, 18, 'f').rect(7, 17, 8, 18, 'f');
  // decoration
  for (const [x, y, ch] of [
    [10, 4, 'T'], [11, 16, 'T'], [27, 6, 'b'], [28, 6, 'b'], [20, 6, 'x'], [2, 7, '*'], [12, 6, '*'], [18, 5, ','],
    [9, 11, 'u'], [21, 12, 'u'], [12, 20, 'r'], [18, 20, '*'], [29, 9, 'b'], [10, 13, ','], [27, 21, 'u'], [3, 21, ','],
    [20, 10, '*'], [6, 11, ','], [29, 15, 'r'],
  ]) g.set(x, y, ch);
  return {
    file: 'brindlewick.tmj',
    map: buildMap({
      grid: g,
      name: 'Brindlewick',
      objects: [
        ['spawn', 'start', 15, 15, { facing: 'up' }],
        ['spawn', 'from_cottage', hesper.door[0], hesper.door[1] + 1, { facing: 'down' }],
        ['warp', 'to_cottage', hesper.door[0], hesper.door[1], { map: 'brindlewick_cottage', spawn: 'from_village' }],
        ['sign', 'locked_door', locked.door[0], locked.door[1], { dialogue: 'brindlewick.locked_door', hidden: true }],
        ['sign', 'mill_door', mill.door[0], mill.door[1], { dialogue: 'brindlewick.mill_door', hidden: true }],
        ['sign', 'well_sign', 13, 13, { dialogue: 'brindlewick.well_sign' }],
        ['npc', 'tobin', 10, 9, { npc: 'tobin' }],
        ['npc', 'jun', 20, 12, { npc: 'jun' }],
        ['npc', 'miller', 22, 9, { npc: 'miller' }],
        ['npc', 'beekeeper', 7, 16, { npc: 'beekeeper' }],
        ['npc', 'gatewarden', 15, 2, { npc: 'gatewarden' }],
        ['chest', 'chest_garden', 3, 15, { chestId: 'brindlewick.garden', item: 'herb', qty: 2 }],
        ['chest', 'chest_pond', 29, 18, { chestId: 'brindlewick.pond', item: 'honey_cake', qty: 1 }],
      ],
    }),
  };
}

export function cottage() {
  const g = new Grid(12, 10, ' ');
  g.rect(1, 1, 10, 2, 'X');
  g.rect(2, 1, 3, 2, 'K');
  g.rect(6, 1, 7, 2, 'P');
  g.set(9, 1, 'N');
  g.rect(1, 3, 10, 8, '_');
  g.rect(5, 5, 8, 7, 'g');
  g.set(10, 3, 'E').set(10, 4, 'E');
  g.set(2, 5, 't').set(3, 5, 't');
  g.set(2, 6, 'c').set(4, 6, 'n');
  g.set(1, 8, 'p').set(10, 8, 'b').set(10, 7, 'x');
  g.set(5, 8, 'M');
  return {
    file: 'brindlewick_cottage.tmj',
    map: buildMap({
      grid: g,
      name: "Hesper's Cottage",
      interior: true,
      objects: [
        ['spawn', 'from_village', 5, 7, { facing: 'up' }],
        ['warp', 'to_village', 5, 8, { map: 'brindlewick', spawn: 'from_cottage' }],
        ['sign', 'letter', 3, 5, { dialogue: 'cottage.letter', hidden: true }],
        ['sign', 'bookshelf', 2, 2, { dialogue: 'cottage.bookshelf', hidden: true }],
        ['npc', 'maelis', 7, 4, { npc: 'maelis' }],
        ['chest', 'chest_hesper', 9, 7, { chestId: 'cottage.hesper', item: 'lantern_oil', qty: 1 }],
      ],
    }),
  };
}

export function artDemo() {
  const rows = [
    '^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^^',
    '#######Q############',
    '#####i#q#i##########',
    '..T...b.....u..r..T.',
    '.......=..*......,..',
    '.r...===.....T......',
    '....==..,..........u',
    '...==..........~~~..',
    'b..=....s.....~~~~~.',
    '...==.*......~~~~~~.',
    '....=====.....~~~~..',
    '.u......====.....*..',
    '....,.......===.....',
  ];
  const g = new Grid(rows[0].length, rows.length);
  rows.forEach((r, y) => [...r].forEach((ch, x) => g.set(x, y, ch)));
  // torches stand in front of the cliff
  return {
    file: 'art_demo.tmj',
    map: buildMap({
      grid: g,
      name: 'Art Demo',
      objects: [
        ['spawn', 'start', 7, 6, { facing: 'down' }],
        ['npc', 'tobin', 9, 7, { npc: 'tobin' }],
        ['sign', 'door', 7, 3, { dialogue: 'art_demo.door', hidden: true }],
      ],
    }),
  };
}
