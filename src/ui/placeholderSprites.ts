import Phaser from 'phaser';
import type { Direction } from '../systems/field/direction';

/** Code-drawn fallbacks for characters without a sprite sheet yet, plus the drop shadow. */

export const CHAR_W = 16;
export const CHAR_H = 24;

export function charTextureKey(color: string, dir: Direction, frame: 0 | 1): string {
  return `char-${color}-${dir}-${frame}`;
}

/** Creates (once) the 4-direction, 2-frame placeholder textures for a character colour. */
export function ensureCharTextures(scene: Phaser.Scene, color: string): void {
  if (scene.textures.exists(charTextureKey(color, 'down', 0))) return;
  const body = Phaser.Display.Color.HexStringToColor(color).color;
  const skin = 0xf2c79b;
  const hair = 0x5a3a22;
  const g = scene.make.graphics({}, false);

  for (const dir of ['up', 'down', 'left', 'right'] as const) {
    for (const frame of [0, 1] as const) {
      g.clear();
      // legs (step frame shifts them apart)
      g.fillStyle(0x3a2a20);
      if (frame === 0) g.fillRect(5, 20, 2, 4).fillRect(9, 20, 2, 4);
      else g.fillRect(4, 20, 2, 3).fillRect(10, 21, 2, 3);
      // body
      g.fillStyle(body).fillRect(3, 10, 10, 11);
      // head
      g.fillStyle(skin).fillRect(4, 2, 8, 8);
      g.fillStyle(hair).fillRect(4, 1, 8, 3);
      if (dir === 'up') g.fillRect(4, 1, 8, 8);
      if (dir === 'down') g.fillStyle(0x000000).fillRect(6, 5, 1, 2).fillRect(9, 5, 1, 2);
      if (dir === 'left') g.fillStyle(hair).fillRect(10, 1, 2, 7).fillStyle(0x000000).fillRect(5, 5, 1, 2);
      if (dir === 'right') g.fillStyle(hair).fillRect(4, 1, 2, 7).fillStyle(0x000000).fillRect(10, 5, 1, 2);
      g.generateTexture(charTextureKey(color, dir, frame), CHAR_W, CHAR_H);
    }
  }
  g.destroy();
}

/** Soft oval drop shadow drawn under every field character. */
export function generateShadowTexture(scene: Phaser.Scene, key: string): void {
  const g = scene.make.graphics({}, false);
  g.fillStyle(0x000000, 0.32).fillEllipse(7, 3, 14, 6);
  g.generateTexture(key, 14, 6);
  g.destroy();
}
