// Character kit: shares Wren's body so each character only defines its head
// (hair or hat), outfit overlays, legs, and weapon.
import { mirror, overlay } from './sprite.mjs';
import { stamp } from './weapons.mjs';
import { BACK_HALF, FRONT_HALF, LEGS_FRONT, LEGS_SIDE, SIDE, withDetails } from './wren.mjs';

const EYES = [
  { y: 12, row: '.......kk......kk.......' },
  { y: 13, row: '.......wi......wi.......' },
  { y: 14, row: '.......ii......ii.......' },
];
const SIDE_EYE = [
  { y: 12, row: '......kk................' },
  { y: 13, row: '......wi................' },
  { y: 14, row: '......ii................' },
];

/** Leg styles: rows 27-31 for each frame. */
export const LEGS = {
  pants: { front: LEGS_FRONT, side: LEGS_SIDE },
  shorts: {
    front: mapLegs(LEGS_FRONT, (r, i) => (i === 1 || i === 2 ? r.replace(/p/g, 's') : r)),
    side: mapLegs(LEGS_SIDE, (r, i) => (i === 1 || i === 2 ? r.replace(/p/g, 's') : r)),
  },
  robe: {
    front: {
      stand: ['......tttttttttttt......', '......tttttttttttt......', '.....tttttttttttttt.....', '.....tttttttttttttt.....', '.......bbb....bbb.......'],
      stepA: ['......tttttttttttt......', '.....tttttttttttt.......', '.....ttttttttttttt......', '....ttttttttttttttt.....', '......bbb.......bbb.....'],
      stepB: ['......tttttttttttt......', '.......tttttttttttt.....', '......ttttttttttttt.....', '.....ttttttttttttttt....', '.....bbb.......bbb......'],
    },
    side: {
      stand: ['........tttttttt........', '........ttttttttt.......', '.......ttttttttttt......', '.......ttttttttttt......', '.......bbb...bbb........'],
      stepA: ['........tttttttt........', '.......ttttttttt........', '......tttttttttttt......', '......ttttttttttttt.....', '.....bbb.......bbb......'],
      stepB: ['........tttttttt........', '........tttttttttt......', '.......tttttttttttt.....', '.......tttttttttttt.....', '......bbbb...bbbb.......'],
    },
  },
};
function mapLegs(set, fn) {
  return Object.fromEntries(Object.entries(set).map(([k, rows]) => [k, rows.map(fn)]));
}

/**
 * def: { front: 14 half-rows (head), side: 11 full rows (head), legs: 'pants'|'shorts'|'robe',
 *        frontDetails, sideDetails, backDetails, weapon: { front, side, back } stamp lists + modes }
 */
export function makeFrame(def) {
  const backHead = def.front.map((r) => r.replace(/s/g, 'h'));
  return function frame(view, legs = 'stand') {
    const L = LEGS[def.legs ?? 'pants'];
    let rows;
    if (view === 'front') {
      rows = withDetails([...mirror([...def.front, ...FRONT_HALF.slice(14)]), ...L.front[legs]], [...EYES, ...(def.frontDetails ?? [])]);
    } else if (view === 'back') {
      rows = withDetails([...mirror([...backHead, ...BACK_HALF.slice(14)]), ...L.front[legs]], def.backDetails ?? []);
    } else {
      rows = withDetails([...def.side, ...SIDE.slice(11), ...L.side[legs]], [...SIDE_EYE, ...(def.sideDetails ?? [])]);
    }
    for (const w of def.weapon?.[view] ?? []) rows = stamp(rows, w.points, w.mode);
    return rows.map((r) => r.slice(0, 24));
  };
}

export { overlay };
