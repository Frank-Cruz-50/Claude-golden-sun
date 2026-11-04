// Tobin Marsh — curly blond hair, teal tunic, cook's apron, frying pan on his back.
import { mirror, overlay } from './sprite.mjs';
import { FRONT_HALF, LEGS_FRONT, LEGS_SIDE, SIDE, withDetails } from './wren.mjs';

export const MATERIALS = {
  h: ['#6a4a14', '#a87a24', '#d8a83c', '#f4d470'], // curly blond hair
  s: ['#a8603c', '#d48c60', '#f0b88a', '#ffdcb4'],
  c: ['#7a6a4a', '#a8987a', '#d0c4a4', '#f0e8d0'], // cream neckerchief
  t: ['#0e3438', '#1a5258', '#2a7a80', '#4aa8ac'], // teal tunic
  a: ['#8a7a5a', '#b8a882', '#ded2b0', '#f8f0dc'], // apron
  l: ['#3a2010', '#5e3a1e', '#86562e', '#ae7a48'],
  p: ['#3a2614', '#56381e', '#76502c', '#98703e'], // brown trousers
  b: ['#2a160c', '#4a2a16', '#6e4222', '#946036'],
  f: ['#1a1a20', '#2e2e38', '#4a4a58', '#7a7a8a'], // frying pan (iron)
};
export const DETAILS = {
  k: '#1a1018', i: '#2a5ab0', w: '#ffffff', m: '#b8604a',
  D: '#8a5e1a', A: '#fff0b0', y: '#f0c860', Y: '#a8782a', L: '#c8955a', M: '#6a4222',
};

// Rounder, fluffier hair: same face, softer silhouette with curls at the sides.
const HAIR_FRONT = [
  '............',
  '............',
  '.........hhh',
  '.......hhhhh',
  '.....hhhhhhh',
  '....hhhhhhhh',
  '...hhhhhhhhh',
  '...hhhhhhhhh',
  '...hhhhhhhhh',
  '...hhhshhhhs',
  '...hhssshhss',
  '...hhsssssss',
  '...hhsssssss',
  '....hsssssss',
];
const FRONT = [...HAIR_FRONT, ...FRONT_HALF.slice(14)];
const APRON = [
  { y: 21, row: '........aaaaaaaa........' },
  { y: 22, row: '........aaaaaaaa........' },
  { y: 23, row: '........aaaaaaaa........' },
  { y: 24, row: '.......laaaaaaaal.......' },
  { y: 25, row: '........aaaaaaaa........' },
  { y: 26, row: '........aaaaaaaa........' },
];
const FRONT_DETAILS = [
  { y: 3, row: '..........AA.A..........' },
  { y: 5, row: '......A..A....A..A......' },
  { y: 6, row: '.....D...D....D...D.....' },
  { y: 8, row: '....D..D..D..D..D..D....' },
  { y: 12, row: '.......kk......kk.......' },
  { y: 13, row: '.......wi......wi.......' },
  { y: 14, row: '.......ii......ii.......' },
  { y: 16, row: '..........mmm...........' },
];

const SIDE_HAIR = [
  '........................',
  '........................',
  '..........hhhhh.........',
  '........hhhhhhhhh.......',
  '.......hhhhhhhhhhh......',
  '......hhhhhhhhhhhhh.....',
  '.....hhhhhhhhhhhhhhh....',
  '.....hhhhhhhhhhhhhhh....',
  '.....hhhhhhhhhhhhhhh....',
  '.....hhsshhhhhhhhhhh....',
  '.....hsssshhhhhhhhhh....',
];
const SIDE_ROWS = [...SIDE_HAIR, ...SIDE.slice(11)];
const SIDE_DETAILS = [
  { y: 3, row: '..........A.A...........' },
  { y: 5, row: '........A...A..A........' },
  { y: 7, row: '.........D...D...D......' },
  { y: 9, row: '............D...D..D....' },
  { y: 12, row: '......kk................' },
  { y: 13, row: '......wi................' },
  { y: 14, row: '......ii................' },
  { y: 16, row: '.......m................' },
  { y: 21, row: '........aaaa............' },
  { y: 22, row: '........aaaa............' },
  { y: 23, row: '........aaaa............' },
  { y: 25, row: '.........aaa............' },
  { y: 26, row: '.........aaa............' },
];

const BACK = [
  '............',
  '............',
  '.........hhh',
  '.......hhhhh',
  '.....hhhhhhh',
  '....hhhhhhhh',
  '...hhhhhhhhh',
  '...hhhhhhhhh',
  '..hhhhhhhhhh',
  '...hhhhhhhhh',
  '...hhhhhhhhh',
  '..hhhhhhhhhh',
  '...hhhhhhhhh',
  '....hhhhhhhh',
  '.....hhhhhhh',
  '......hhhhhh',
  '.......hhhhh',
  ...FRONT_HALF.slice(17),
];
const BACK_DETAILS = [
  { y: 3, row: '..........AA.A..........' },
  { y: 5, row: '......AA....AA..........' },
  { y: 7, row: '.......DD......DD.......' },
  { y: 8, row: '......D..........D......' },
  { y: 10, row: '.....DD....DD....DD.....' },
  { y: 13, row: '........DD....DD........' },
  // frying pan slung flat across the back, handle over the right shoulder
  { y: 17, row: '................l.......' },
  { y: 18, row: '...............lf.......' },
  { y: 19, row: '..............ff........' },
  { y: 20, row: '..........fffff.........' },
  { y: 19, row: '...........AA...........' },
  { y: 21, row: '.........fffffff........' },
  { y: 22, row: '.........fffffff........' },
  { y: 23, row: '.........fffffff........' },
  { y: 24, row: '..........fffff.........' },
];

const clip = (rows) => rows.map((r) => r.slice(0, 24));

export function frame(view, legs) {
  if (view === 'front') {
    let rows = withDetails([...mirror(FRONT), ...LEGS_FRONT[legs]], FRONT_DETAILS);
    for (const { y, row } of APRON) rows = overlay(rows, [row], y);
    return rows;
  }
  if (view === 'back') return clip(withDetails([...mirror(BACK), ...LEGS_FRONT[legs]], BACK_DETAILS));
  return withDetails([...SIDE_ROWS, ...LEGS_SIDE[legs]], SIDE_DETAILS);
}
