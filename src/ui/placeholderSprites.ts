import Phaser from 'phaser';
import { TextureKeys, TILE_SIZE } from '../config';
import type { Direction } from '../systems/field/direction';

/** Code-drawn placeholder art. Replaced by real sprite sheets in M3. */

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

export function generateObjectTextures(scene: Phaser.Scene): void {
  const g = scene.make.graphics({}, false);

  g.fillStyle(0x7a4a22).fillRect(1, 4, 14, 11);
  g.fillStyle(0x9a6a32).fillRect(1, 4, 14, 4);
  g.fillStyle(0xe8c860).fillRect(1, 7, 14, 1).fillRect(7, 6, 2, 4);
  g.generateTexture(TextureKeys.ChestClosed, TILE_SIZE, TILE_SIZE);
  g.clear();

  g.fillStyle(0x7a4a22).fillRect(1, 8, 14, 7);
  g.fillStyle(0x3a2210).fillRect(2, 5, 12, 4);
  g.fillStyle(0x9a6a32).fillRect(1, 1, 14, 4);
  g.fillStyle(0xe8c860).fillRect(1, 8, 14, 1);
  g.generateTexture(TextureKeys.ChestOpen, TILE_SIZE, TILE_SIZE);
  g.clear();

  g.fillStyle(0x6e4a2a).fillRect(7, 9, 2, 7);
  g.fillStyle(0xb08050).fillRect(1, 2, 14, 8);
  g.fillStyle(0x6e4a2a).fillRect(3, 4, 10, 1).fillRect(3, 7, 8, 1);
  g.generateTexture(TextureKeys.Sign, TILE_SIZE, TILE_SIZE);

  g.destroy();
}
