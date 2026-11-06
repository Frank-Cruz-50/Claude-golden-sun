import Phaser from 'phaser';
import { PropFrames, TILE_SIZE, UiKeys } from '../config';

export class Chest {
  readonly sprite: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    readonly tileX: number,
    readonly tileY: number,
    opened: boolean,
  ) {
    this.sprite = scene.add
      .image(tileX * TILE_SIZE, tileY * TILE_SIZE, UiKeys.Props, opened ? PropFrames.ChestOpen : PropFrames.ChestClosed)
      .setOrigin(0)
      .setDepth((tileY + 1) * TILE_SIZE - 1);
  }

  open(): void {
    this.sprite.setFrame(PropFrames.ChestOpen);
  }
}
