// Builds a 72x128 character sheet: 3 frames (stand, stepA, stepB) x rows down/left/right/up, 24x32 each.
import { Canvas } from './lib.mjs';
import { renderSprite } from './sprite.mjs';

export const FRAME_W = 24;
export const FRAME_H = 32;

export function buildSheet(def) {
  const sheet = new Canvas(FRAME_W * 3, FRAME_H * 4);
  const rows = [['front', false], ['side', false], ['side', true], ['back', false]];
  rows.forEach(([view, flip], r) =>
    ['stand', 'stepA', 'stepB'].forEach((legs, f) => {
      const img = renderSprite(def.frame(view, legs), def.MATERIALS, def.DETAILS);
      sheet.blit(img, f * FRAME_W, r * FRAME_H, 0, 0, FRAME_W, FRAME_H, flip);
    }),
  );
  return sheet;
}

/** 32x32 battle-stance frame (facing left). */
export function buildBattleFrame(def) {
  return renderSprite(def.frame('battle'), def.MATERIALS, def.DETAILS);
}
