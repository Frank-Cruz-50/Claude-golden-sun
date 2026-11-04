// Wren Ashby — 24x32 field sprite drafts.
import { mirror, overlay, renderSprite } from './sprite.mjs';

export const MATERIALS = {
  h: ['#3a1c0c', '#6a3818', '#9a5826', '#c8843c'], // hair
  s: ['#a8603c', '#d48c60', '#f0b88a', '#ffdcb4'], // skin
  c: ['#6a1a14', '#a02e22', '#d04a34', '#f07a5a'], // red neckerchief
  t: ['#1e3418', '#34542a', '#4f7a3a', '#76a454'], // olive tunic
  l: ['#3a2010', '#5e3a1e', '#86562e', '#ae7a48'], // leather
  p: ['#2a2238', '#3e3454', '#5a4e74', '#7a6e96'], // trousers
  b: ['#2a160c', '#4a2a16', '#6e4222', '#946036'], // boots
};
export const DETAILS = {
  k: '#1a1018', // lash / pupil
  i: '#2e7a5a', // iris (green)
  w: '#ffffff', // eye highlight
  m: '#b8604a', // mouth
  D: '#5a2c12', // hair strand shadow
  L: '#c8955a', // strap
  M: '#6a4222', // strap shade
  y: '#f0c860', // buckle
  Y: '#a8782a', // buckle shade
  A: '#f0b060', // hair shine
};

// Front view, left half (mirrored to 24 wide).
export const FRONT_HALF = [
  '............',
  '..........h.',
  '......h..hh.',
  '......hhhhhh',
  '.....hhhhhhh',
  '....hhhhhhhh',
  '...hhhhhhhhh',
  '....hhhhhhhh',
  '...hhhhhhhhh',
  '....hhhshhhs',
  '....hhsshhss',
  '....hsssssss',
  '....hsssssss',
  '....hsssssss',
  '.....sssssss',
  '......ssssss',
  '.......sssss',
  '.........sss',
  '........cccc',
  '......tccccc',
  '.....ttttccc',
  '.....t.ttttt',
  '.....t.ttttt',
  '.....l.ttttt',
  '.....s.lllll',
  '.....s.ttttt',
  '.......ttttt',
];
const FRONT_DETAILS = [
  { y: 3, row: '..........A.............' },
  { y: 5, row: '.......AA....A..........' },
  { y: 12, row: '.......kk......kk.......' },
  { y: 13, row: '.......wi......wi.......' },
  { y: 14, row: '.......ii......ii.......' },
  { y: 4, row: '........D......D........' },
  { y: 5, row: '........D...D...D.......' },
  { y: 6, row: '.........D..D..D........' },
  { y: 7, row: '.....D.........D..D.....' },
  { y: 8, row: '......D...D...D...D.....' },
  { y: 16, row: '...........m............' },
  // satchel strap across the chest
  { y: 19, row: '...............LM.......' },
  { y: 20, row: '..............LM........' },
  { y: 21, row: '.............LM.........' },
  { y: 22, row: '............LM..........' },
  { y: 23, row: '...........LM...........' },
  { y: 24, row: '...........yY...........' },
];

export const LEGS_FRONT = {
  stand: [
    '.......pppppppppp.......',
    '.......pppp..pppp.......',
    '.......pppp..pppp.......',
    '.......bbbb..bbbb.......',
    '......bbbbb..bbbbb......',
  ],
  stepA: [
    '.......pppppppppp.......',
    '.......pppp..pppp.......',
    '.......pppp..bbbb.......',
    '.......bbbb.bbbbb.......',
    '......bbbbb.............',
  ],
  stepB: [
    '.......pppppppppp.......',
    '.......pppp..pppp.......',
    '.......bbbb..pppp.......',
    '.......bbbbb.bbbb.......',
    '.............bbbbb......',
  ],
};

export function withDetails(rows, details) {
  let out = rows;
  for (const { y, row } of details) out = overlay(out, [row], y);
  return out;
}

export function frontFrame(legs) {
  const body = mirror(FRONT_HALF);
  return withDetails([...body, ...LEGS_FRONT[legs]], FRONT_DETAILS);
}

export function renderFront(legs = 'stand') {
  return renderSprite(frontFrame(legs), MATERIALS, DETAILS);
}

export const SIDE = [
  '........................',
  '..........h..h..........',
  '.........hh.hh.h........',
  '........hhhhhhhhh.......',
  '.......hhhhhhhhhhh......',
  '......hhhhhhhhhhhhh.....',
  '.....hhhhhhhhhhhhhhh....',
  '......hhhhhhhhhhhhhh....',
  '.....hhhhhhhhhhhhhhh....',
  '.....hhsshhhhhhhhhhh....',
  '.....hsssshhhhhhhhh.....',
  '....ssssssshhhhhhhh.....',
  '....sssssssshhhhhh......',
  '....sssssssssshhhh......',
  '.....ssssssssshhhh......',
  '......sssssssshh........',
  '.......ssssssss.........',
  '..........sss...........',
  '.........ccccc..........',
  '........cccccccc........',
  '........tttttttt........',
  '........tttttttt........',
  '........ttttttttt.......',
  '........tttllttttt......',
  '........llllllllll......',
  '.........ttsstttLL......',
  '.........tttttttLL......',
];
const SIDE_DETAILS = [
  { y: 3, row: '..........A.A...........' },
  { y: 5, row: '........AA..............' },
  { y: 6, row: '..........D.....D.......' },
  { y: 7, row: '.........D.....D...D....' },
  { y: 8, row: '.........D....D...D.....' },
  { y: 9, row: '..............D..D......' },
  { y: 10, row: '.............D...D......' },
  { y: 12, row: '......kk................' },
  { y: 13, row: '......wi................' },
  { y: 14, row: '......ii................' },
  { y: 16, row: '.......m................' },
  { y: 24, row: '..........yY............' },
];
export const LEGS_SIDE = {
  stand: [
    '.........pppppppp.......',
    '..........pppppp........',
    '..........pppppp........',
    '..........bbbbbb........',
    '.........bbbbbbb........',
  ],
  stepA: [
    '.........pppppppp.......',
    '........pppp..ppp.......',
    '.......pppp....ppp......',
    '.......bbbb....bbbb.....',
    '......bbbbb.....bbbb....',
  ],
  stepB: [
    '.........pppppppp.......',
    '.........pppp.ppp.......',
    '........pppp...ppp......',
    '........bbbb...bbbb.....',
    '.......bbbbb...bbbbb....',
  ],
};

const BACK_HALF = [
  ...FRONT_HALF.slice(0, 9),
  '....hhhhhhhh',
  '....hhhhhhhh',
  '....hhhhhhhh',
  '....hhhhhhhh',
  '....hhhhhhhh',
  '.....hhhhhhh',
  '......hhhhhh',
  '.......hhhhh',
  ...FRONT_HALF.slice(17),
];
const BACK_DETAILS = [
  { y: 3, row: '..........A.............' },
  { y: 5, row: '.......AA....A..........' },
  { y: 5, row: '.........D....D.........' },
  { y: 6, row: '........D......D........' },
  { y: 7, row: '.......D..D..D..D.......' },
  { y: 8, row: '.........D....D.........' },
  { y: 9, row: '.........D....D.........' },
  { y: 10, row: '.......D........D.......' },
  { y: 11, row: '......D...D..D...D......' },
  { y: 12, row: '......D...D..D...D......' },
  { y: 13, row: '.........D....D.........' },
  { y: 19, row: '.......ML...............' },
  { y: 20, row: '........ML..............' },
  { y: 21, row: '.........ML.............' },
  { y: 22, row: '..........ML............' },
  { y: 23, row: '...........ML...........' },
];

export function frame(view, legs) {
  if (view === 'front') return withDetails([...mirror(FRONT_HALF), ...LEGS_FRONT[legs]], FRONT_DETAILS);
  if (view === 'back') return withDetails([...mirror(BACK_HALF), ...LEGS_FRONT[legs]], BACK_DETAILS);
  return withDetails([...SIDE, ...LEGS_SIDE[legs]], SIDE_DETAILS);
}
