// Field characters: 16x24 frames, 4 directions x 3 frames (stand, stepA, stepB).
// Sheet layout: columns = frames, rows = down, left, right, up.
import { Canvas, grid, hex } from './lib.mjs';

const TOP_DOWN = [
  '................',
  '.....o..o.o.....',
  '....olooyolo.o..',
  '...ohllhllhlooo.',
  '..ohhyhhhhhhhho.',
  '..ohhhhhhhhhhHo.',
  '.oHhhhhhhhhhhHHo',
  '.oHHhHshhhhsHHHo',
  '.oHHsssssssssHo.',
  '..oHseSsssSeSHo.',
  '..oSswSsssSwSSo.',
  '...oSssssssSSo..',
  '....ooSSSSSoo...',
  '...occCCCCCcco..',
  '..ouucccccccTto.',
  '.oSoutkttttuTToS',
  '.oSouttkttuTTToS',
  '..oottttkttTTo..',
  '...oBBBBBBBBBo..',
];
const TOP_UP = [
  '................',
  '.....o..o.o.....',
  '....olooyolo.o..',
  '...ohllhllhlooo.',
  '..ohhyhhhhhhhho.',
  '..ohhhhhhhhhhHo.',
  '.oHhhhhhhhhhhHHo',
  '.oHhhhhhhhhhhHHo',
  '.oHHhhhhhhhhHHHo',
  '..oHHhhhhhhHHHo.',
  '..oHHHhhhhHHHHo.',
  '...oHHHHHHHHHo..',
  '....ooSSSSSoo...',
  '...occCCCCCcco..',
  '..ouuktttttTTo..',
  '.oSoutkttttTTToS',
  '.oSouttkttTTTToS',
  '..oottttkTTTTo..',
  '...oBBBBBBBBBo..',
];
const TOP_LEFT = [
  '................',
  '......o.o.o.....',
  '.....olylolo.o..',
  '....ohlhhllhoho.',
  '...ohhhhyhhhhho.',
  '..ohhhhhhhhhhHo.',
  '..ohhhhhhhhhHHHo',
  '..ossHhhhhhHHHHo',
  '.osssssshhHHHHo.',
  '.osSeSsssHHHHo..',
  '..osSwSssSHHHo..',
  '...oSsssSSHHo...',
  '....oooSSSoo....',
  '....occCCCco....',
  '...ouucccTTo....',
  '...oSouttTTTo...',
  '...oSoukttTTo...',
  '...oottktTTTo...',
  '...oBBBBBBBBo...',
];
const LEGS = {
  stand: ['....oppPPpPo....', '....oppoopPo....', '....oppooPPo....', '....obboobbo....', '....oooooooo....'],
  stepA: ['....oppPPpPo....', '....oppoopPo....', '....oppooooo....', '....obbo........', '....oooo........'],
  stepB: ['....oppPPpPo....', '....ooooopPo....', '........oPPo....', '........obbo....', '........oooo....'],
  sideStand: ['....opppPPo.....', '....oppoPPo.....', '....oppoPPo.....', '...obboobbo.....', '...oooooooo.....'],
  sideA: ['....opppPPo.....', '...oppoo.oPo....', '..oppo....oPPo..', '..obbo....obbo..', '..oooo....oooo..'],
  sideB: ['....opppPPo.....', '....oppPPo......', '....oppPPo......', '....obbbbo......', '....oooooo......'],
};

function frame(top, legs, palette, bob = 0) {
  const c = new Canvas(16, 24);
  c.blit(grid(top, palette), 0, bob);
  c.blit(grid(legs, palette), 0, 19);
  return c;
}

export const PALETTES = {
  wren: {
    o: hex('#2b1d1a'), H: hex('#5a2e14'), h: hex('#8a4a1e'), l: hex('#c47a32'), y: hex('#e8a84a'),
    s: hex('#f6cfa2'), S: hex('#d99a6a'), e: hex('#1e2a4a'), w: hex('#ffffff'),
    T: hex('#2e4a24'), t: hex('#4f7a32'), u: hex('#7aa84a'),
    c: hex('#c8503a'), C: hex('#8a2e24'), k: hex('#6a4422'), B: hex('#5a3a20'),
    p: hex('#6a5a7a'), P: hex('#443a56'), b: hex('#7a4a24'),
  },
  tobin: {
    o: hex('#2b1d1a'), H: hex('#8a6a2a'), h: hex('#c8a04a'), l: hex('#e8c870'), y: hex('#f8e8a0'),
    s: hex('#f6cfa2'), S: hex('#d99a6a'), e: hex('#1e2a4a'), w: hex('#ffffff'),
    T: hex('#1e4a5a'), t: hex('#2e7a8a'), u: hex('#5aaab8'),
    c: hex('#e8e0c8'), C: hex('#b8a888'), k: hex('#6a4422'), B: hex('#5a3a20'),
    p: hex('#6a4a2a'), P: hex('#4a321e'), b: hex('#5a3a20'),
  },
};

/** 48x96 sheet: 3 frames (stand, stepA, stepB) x 4 rows (down, left, right, up). */
export function characterSheet(palette) {
  const sheet = new Canvas(48, 96);
  const rows = [
    [TOP_DOWN, ['stand', 'stepA', 'stepB'], false],
    [TOP_LEFT, ['sideStand', 'sideA', 'sideB'], false],
    [TOP_LEFT, ['sideStand', 'sideA', 'sideB'], true],
    [TOP_UP, ['stand', 'stepB', 'stepA'], false],
  ];
  rows.forEach(([top, legs, flip], r) =>
    legs.forEach((l, f) => {
      const fr = frame(top, LEGS[l], palette, f === 0 ? 0 : -1 * 0);
      sheet.blit(fr, f * 16, r * 24, 0, 0, 16, 24, flip);
    }),
  );
  return sheet;
}
