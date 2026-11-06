// Jun, Maelis, and Brindlewick villagers, built with the character kit.
import { makeFrame } from './people.mjs';
import { sword } from './weapons.mjs';

const SKIN = ['#a8603c', '#d48c60', '#f0b88a', '#ffdcb4'];
const SKIN_OLD = ['#9a6044', '#c88c68', '#e4b48e', '#f8d4b4'];
const BOOTS = ['#2a160c', '#4a2a16', '#6e4222', '#946036'];
const LEATHER = ['#3a2010', '#5e3a1e', '#86562e', '#ae7a48'];
const BASE_DETAILS = { k: '#1a1018', w: '#ffffff', m: '#b8604a', y: '#f0c860', Y: '#a8782a', L: '#c8955a', M: '#6a4222' };

const line = (x0, y0, x1, y1, ch) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  return Array.from({ length: n + 1 }, (_, i) => [Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), ch]);
};

// ---------------------------------------------------------------- Jun
export const jun = {
  MATERIALS: {
    h: ['#6a1408', '#a8260e', '#d84a1a', '#f88038'], s: SKIN, j: ['#8a6a10', '#c8a020', '#f0d040', '#fff4a0'],
    c: ['#8a5a0a', '#c8861a', '#f0b030', '#ffd870'], t: ['#2e1a14', '#4a2a1e', '#6e402c', '#925a3e'],
    l: ['#5a2a14', '#8a4422', '#b86a34', '#e0944e'], p: ['#4a2010', '#6e3018', '#944424', '#b85e34'], b: BOOTS,
    e: ['#3a4250', '#6a7488', '#a8b2c4', '#eef4fc'], g: ['#5a3c0a', '#9a7016', '#d8aa2c', '#fff0a0'], v: LEATHER,
  },
  DETAILS: { ...BASE_DETAILS, i: '#c87a1a', A: '#ffb070', D: '#7a1a0a' },
};
jun.frame = makeFrame({
  legs: 'shorts',
  front: [
    '............', '..........h.', '.......h.hhh', '......hhhhhh', '.....hhhhhhh', '....hhhhhhhh', '...hhhhhhhhh',
    '...jjjjjjjjj', '...hhhhhhhhh', '..hhhshhhshh', '..hhsssshsss', '...hssssssss', '...hssssssss', '....hsssssss',
  ],
  side: [
    '........................', '..........h..h..........', '.........hhhhhh.h.......', '........hhhhhhhhhh......',
    '.......hhhhhhhhhhhh.....', '......hhhhhhhhhhhhh.....', '.....hhhhhhhhhhhhhhhhh..', '.....jjjjjjjjjjjjjjhhhh.',
    '.....hhhhhhhhhhhhhh.hhh.', '.....hhsshhhhhhhhhh..hh.', '.....hsssshhhhhhhhh...h.',
  ],
  frontDetails: [
    { y: 4, row: '........A......A........' }, { y: 9, row: '.....D.....DD.....D.....' }, { y: 16, row: '...........m............' },
  ],
  sideDetails: [{ y: 4, row: '.........AA.............' }, { y: 16, row: '.......m................' }],
  backDetails: [
    { y: 4, row: '........A......A........' },
    // ponytail hanging from the headband
    ...[15, 16, 17, 18, 19].map((y) => ({ y, row: '..........hhhh..........'.slice(0, 24) })),
    { y: 20, row: '...........hh...........' },
  ],
  weapon: {
    front: [{ points: sword(18, 21, 20, 29, { thick: false }), mode: 'behind' }],
    side: [{ points: sword(16, 22, 18, 30, { thick: false }), mode: 'behind' }],
    back: [{ points: sword(5, 21, 3, 29, { thick: false }), mode: 'front' }],
  },
});

// ---------------------------------------------------------------- Maelis
const lanternStaff = (x, top, bottom) => [
  ...line(x, top + 4, x, bottom, 'l'),
  ...[[x - 1, top], [x, top], [x + 1, top]].map(([a, b]) => [a, b, 'g']),
  ...[[x - 2, top + 1], [x + 2, top + 1], [x - 2, top + 2], [x + 2, top + 2], [x - 2, top + 3], [x + 2, top + 3]].map(([a, b]) => [a, b, 'g']),
  ...[[x - 1, top + 1], [x, top + 1], [x + 1, top + 1], [x - 1, top + 2], [x + 1, top + 2], [x - 1, top + 3], [x, top + 3], [x + 1, top + 3]].map(([a, b]) => [a, b, 'Z']),
  [x, top + 2, 'z'],
];
export const maelis = {
  MATERIALS: {
    h: ['#6a6a80', '#9a9ab0', '#c8c8d8', '#f0f0fa'], s: SKIN_OLD,
    c: ['#14286a', '#24449a', '#3a66c8', '#6a96e8'], t: ['#7a7060', '#aea48e', '#dcd4be', '#fcf8ec'],
    l: LEATHER, b: ['#3a2a4a', '#54426a', '#6e5a8a', '#8a76a8'], g: ['#5a3c0a', '#9a7016', '#d8aa2c', '#fff0a0'],
  },
  DETAILS: { ...BASE_DETAILS, i: '#5a7aa8', A: '#ffffff', D: '#7a7a90', Z: '#ffd860', z: '#fffbe0', S: '#c88c68' },
};
maelis.frame = makeFrame({
  legs: 'robe',
  front: [
    '............', '............', '..........hh', '.......hhhhh', '.....hhhhhhh', '....hhhhhhhh', '...hhhhhhhhh',
    '...hhhhhhhhs', '...hhhhhhhss', '...hhhhhssss', '..hhhhssssss', '..hhhsssssss', '..hhhsssssss', '..hhhhssssss',
  ],
  side: [
    '........................', '........................', '..........hhhhh.........', '........hhhhhhhhh.......',
    '.......hhhhhhhhhhh......', '......hhhhhhhhhhhhh.....', '.....hhhhhhhhhhhhhhh....', '.....hhhhhhhhhhhhhhh....',
    '.....hhhhhhhhhhhhhhh....', '.....hhsshhhhhhhhhhh....', '.....hsssshhhhhhhhhh....',
  ],
  frontDetails: [
    { y: 4, row: '.........AA..AA.........' }, { y: 15, row: '......S..........S......' },
    { y: 16, row: '...........mm...........' },
    // silver hair falling over the shoulders
    ...[14, 15, 16, 17, 18, 19].map((y) => ({ y, row: '..hhh...............hhh.' })),
    // blue sash instead of a belt
    { y: 24, row: '.......cccccccccc.......' },
  ],
  sideDetails: [
    { y: 4, row: '.........AA.............' }, { y: 16, row: '.......m................' },
    ...[11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((y) => ({ y, row: '...............hhhh.....' })),
    { y: 24, row: '........cccccccccc......' },
  ],
  backDetails: [
    { y: 4, row: '.........AA..AA.........' },
    ...[17, 18, 19, 20, 21].map((y) => ({ y, row: '.......hhhhhhhhhh.......' })),
    { y: 22, row: '........hhhhhhhh........' }, { y: 23, row: '..........hhhh..........' },
    { y: 24, row: '.......cccccccccc.......' },
  ],
  weapon: {
    front: [{ points: lanternStaff(20, 0, 31), mode: 'behind' }],
    side: [{ points: lanternStaff(19, 0, 31), mode: 'behind' }],
    back: [{ points: lanternStaff(4, 0, 31), mode: 'front' }],
  },
});

// ---------------------------------------------------------------- villagers
const apron = [21, 22, 23, 24, 25, 26].map((y) => ({ y, row: y === 24 ? '.......laaaaaaaal.......' : '........aaaaaaaa........' }));
const mustache = [{ y: 15, row: '.........hhhhhh.........' }, { y: 16, row: '.........h....h.........' }];

export const miller = {
  MATERIALS: {
    h: ['#3a2210', '#5e3a1c', '#86562c', '#a8763e'], j: ['#9a9a9a', '#c8c8c8', '#ececec', '#ffffff'], s: SKIN,
    c: ['#5a4a2a', '#86703e', '#ae9658', '#d0ba7a'], t: ['#4a3420', '#6e4e30', '#946a42', '#b8885a'],
    a: ['#9a9a9a', '#c8c8c8', '#ececec', '#ffffff'], l: LEATHER, p: ['#2e2a24', '#4a4438', '#686050', '#8a806c'], b: BOOTS,
  },
  DETAILS: { ...BASE_DETAILS, i: '#4a3a2a', A: '#ffffff', D: '#3a2210' },
};
miller.frame = makeFrame({
  front: [
    '............', '............', '.........jjj', '.......jjjjj', '.....jjjjjjj', '....jjjjjjjj', '...jjjjjjjjj',
    '...jjjjjjjjj', '...hhhhhhhhh', '...hhsssssss', '...hssssssss', '....hsssssss', '....hsssssss', '....hsssssss',
  ],
  side: [
    '........................', '........................', '..........jjjjj.........', '........jjjjjjjjj.......',
    '.......jjjjjjjjjjj......', '......jjjjjjjjjjjjj.....', '.....jjjjjjjjjjjjjjj....', '....jjjjjjjjjjjjjjjj....',
    '.....hhhhhhhhhhhhhhh....', '.....hhsshhhhhhhhhhh....', '.....hsssshhhhhhhhhh....',
  ],
  frontDetails: [...mustache, ...apron, { y: 9, row: '......A..A..A..A........' }],
  sideDetails: [{ y: 15, row: '......hhh...............' }, ...apron.map((d) => ({ y: d.y, row: '........aaaa............' }))],
  backDetails: [{ y: 24, row: '.......llllllllll.......' }],
});

export const beekeeper = {
  MATERIALS: {
    h: ['#6a6a70', '#9a9aa0', '#c4c4ca', '#ececf0'], j: ['#7a5a1a', '#b88a2a', '#e0b84a', '#f8e08a'], s: SKIN_OLD,
    c: ['#5a6a2a', '#7a8a3a', '#9aaa52', '#c0cc78'], t: ['#4a5220', '#6a7430', '#8e9a44', '#b4c060'],
    a: ['#9a9a8a', '#c8c8b8', '#ececdc', '#ffffff'], l: LEATHER, b: BOOTS,
  },
  DETAILS: { ...BASE_DETAILS, i: '#4a6a4a', A: '#fff4c0', D: '#8a6a1a', S: '#c88c68' },
};
beekeeper.frame = makeFrame({
  legs: 'robe',
  front: [
    '............', '............', '..........jj', '........jjjj', '.......jjjjj', '.......jjjjj', '......jjjjjj',
    '.jjjjjjjjjjj', '...hhhhhhhhh', '...hhsssssss', '...hssssssss', '....hsssssss', '....hsssssss', '....hsssssss',
  ],
  side: [
    '........................', '........................', '...........jjjj.........', '.........jjjjjjjj.......',
    '........jjjjjjjjjj......', '........jjjjjjjjjj......', '.......jjjjjjjjjjjj.....', '..jjjjjjjjjjjjjjjjjjjjj.',
    '.....hhhhhhhhhhhhhhh....', '.....hhsshhhhhhhhhhh....', '.....hsssshhhhhhhhhh....',
  ],
  frontDetails: [...apron, { y: 15, row: '......S..........S......' }, { y: 16, row: '...........mm...........' }, { y: 5, row: '.......DDDDDDDDDD.......' }],
  sideDetails: [{ y: 16, row: '.......m................' }, { y: 5, row: '........DDDDDDDDDD......' }],
  backDetails: [{ y: 5, row: '.......DDDDDDDDDD.......' }, { y: 15, row: '..........hhhh..........' }, { y: 16, row: '..........hhhh..........' }],
});

const spear = (x0, y0, x1, y1) => [...line(x0, y0 + 3, x1, y1, 'l'), [x0, y0, 'e'], [x0, y0 + 1, 'e'], [x0 - 1, y0 + 2, 'e'], [x0, y0 + 2, 'e'], [x0 + 1, y0 + 2, 'e']];
export const watchman = {
  MATERIALS: {
    h: ['#3a2210', '#5e3a1c', '#86562c', '#a8763e'], j: ['#3a4250', '#6a7488', '#a8b2c4', '#eef4fc'], s: SKIN,
    c: ['#3a4250', '#6a7488', '#a8b2c4', '#eef4fc'], t: ['#14244a', '#22387a', '#3456a8', '#5a7ed0'],
    l: LEATHER, p: ['#2e2a24', '#4a4438', '#686050', '#8a806c'], b: BOOTS, e: ['#3a4250', '#6a7488', '#a8b2c4', '#eef4fc'],
  },
  DETAILS: { ...BASE_DETAILS, i: '#3a4a6a', A: '#ffffff', D: '#3a4250' },
};
watchman.frame = makeFrame({
  front: [
    '............', '............', '.........jjj', '.......jjjjj', '.....jjjjjjj', '....jjjjjjjj', '...jjjjjjjjj',
    '...jjjjjjjjj', '..jjjjjjjjjj', '...hhsssssss', '...hssssssss', '....hsssssss', '....hsssssss', '....hsssssss',
  ],
  side: [
    '........................', '........................', '..........jjjjj.........', '........jjjjjjjjj.......',
    '.......jjjjjjjjjjj......', '......jjjjjjjjjjjjj.....', '.....jjjjjjjjjjjjjjj....', '.....jjjjjjjjjjjjjjj....',
    '....jjjjjjjjjjjjjjjjj...', '.....hhsshhhhhhhhhhh....', '.....hsssshhhhhhhhhh....',
  ],
  frontDetails: [...mustache, { y: 4, row: '........AA..............' }, { y: 22, row: '...........yy...........' }],
  sideDetails: [{ y: 15, row: '......hhh...............' }, { y: 4, row: '.........AA.............' }],
  backDetails: [{ y: 4, row: '........AA..............' }],
  weapon: {
    front: [{ points: spear(20, 0, 19, 31), mode: 'behind' }],
    side: [{ points: spear(19, 0, 18, 31), mode: 'behind' }],
    back: [{ points: spear(3, 0, 4, 31), mode: 'front' }],
  },
});
