import Phaser from 'phaser';
import { TextureKeys, TILE_SIZE } from '../config';

export class Chest {
  readonly sprite: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    readonly tileX: number,
    readonly tileY: number,
    opened: boolean,
  ) {
    this.sprite = scene.add
      .image(tileX * TILE_SIZE, tileY * TILE_SIZE, opened ? TextureKeys.ChestOpen : TextureKeys.ChestClosed)
      .setOrigin(0)
      .setDepth((tileY + 1) * TILE_SIZE - 1);
  }

  open(): void {
    this.sprite.setTexture(TextureKeys.ChestOpen);
  }
}
