import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, mapCacheKey, SceneKeys, TextureKeys } from '../config';
import maps from '../data/maps.json';
import strings from '../data/strings.json';
import { generateObjectTextures } from '../ui/placeholderSprites';
import { textStyle } from '../ui/textStyle';
import tilesetUrl from '../../assets/tilesets/placeholder.png?url';

const mapUrls = import.meta.glob('../../assets/maps/*.tmj', { query: '?url', import: 'default', eager: true }) as Record<
  string,
  string
>;

/** Loads maps and tilesets. Characters and objects use code-drawn placeholders until M3. */
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

    this.load.image(TextureKeys.Tiles, tilesetUrl);
    for (const [id, entry] of Object.entries(maps)) {
      const url = mapUrls[`../../assets/maps/${entry.file}`];
      if (!url) throw new Error(`maps.json: file not found for "${id}": ${entry.file}`);
      this.load.tilemapTiledJSON(mapCacheKey(id), url);
    }
  }

  create(): void {
    generateObjectTextures(this);
    this.scene.start(SceneKeys.Title);
  }
}
