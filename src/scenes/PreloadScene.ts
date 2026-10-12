import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SceneKeys, TextureKeys, TILE_SIZE } from '../config';
import strings from '../data/strings.json';
import { textStyle } from '../ui/textStyle';

/** Loads assets. Until M3 it generates flat-colour placeholder textures. */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preload);
  }

  preload(): void {
    const label = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, strings.preload.loading, textStyle())
      .setOrigin(0.5);
    const barWidth = 120;
    const barX = (GAME_WIDTH - barWidth) / 2;
    const barY = GAME_HEIGHT / 2 + 4;
    this.add.rectangle(barX, barY, barWidth, 6).setOrigin(0).setStrokeStyle(1, 0xffffff);
    const fill = this.add.rectangle(barX + 1, barY + 1, 0, 4, 0xffffff).setOrigin(0);
    this.load.on('progress', (p: number) => (fill.width = (barWidth - 2) * p));
    this.load.on('complete', () => label.destroy());
  }

  create(): void {
    this.generatePlaceholders();
    this.scene.start(SceneKeys.Title);
  }

  private generatePlaceholders(): void {
    const g = this.make.graphics({}, false);

    g.fillStyle(0x3a7d44).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x47924f).fillRect(2, 3, 2, 2).fillRect(10, 9, 2, 2);
    g.generateTexture(TextureKeys.Ground, TILE_SIZE, TILE_SIZE);
    g.clear();

    g.fillStyle(0x346f3d).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x47924f).fillRect(6, 6, 2, 2);
    g.generateTexture(TextureKeys.GroundAlt, TILE_SIZE, TILE_SIZE);
    g.clear();

    // 16x24 character placeholder: body + head + facing dot.
    g.fillStyle(0x2b4c9b).fillRect(3, 10, 10, 13);
    g.fillStyle(0xf2c79b).fillRect(4, 2, 8, 8);
    g.fillStyle(0x000000).fillRect(6, 5, 1, 2).fillRect(9, 5, 1, 2);
    g.generateTexture(TextureKeys.Player, 16, 24);

    g.destroy();
  }
}
