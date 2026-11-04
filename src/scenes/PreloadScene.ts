import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, mapCacheKey, SceneKeys, tilesetTextureKey } from '../config';
import maps from '../data/maps.json';
import strings from '../data/strings.json';
import { SHADOW_TEXTURE } from '../entities/GridCharacter';
import { generateObjectTextures, generateShadowTexture } from '../ui/placeholderSprites';
import { textStyle } from '../ui/textStyle';

const tilesetUrls = import.meta.glob('../../assets/tilesets/*.png', { query: '?url', import: 'default', eager: true }) as Record<
  string,
  string
>;
const spriteUrls = import.meta.glob('../../assets/sprites/*.png', { query: '?url', import: 'default', eager: true }) as Record<
  string,
  string
>;
const fileName = (path: string) => path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));

const mapUrls = import.meta.glob('../../assets/maps/*.tmj', { query: '?url', import: 'default', eager: true }) as Record<
  string,
  string
>;

/** Loads maps, tilesets, and character sheets. Chests/signs are still code-drawn placeholders. */
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

    for (const [path, url] of Object.entries(tilesetUrls)) this.load.image(tilesetTextureKey(fileName(path)), url);
    // Character sheets: 16x24 frames, 3 per row (stand, stepA, stepB), rows down/left/right/up.
    for (const [path, url] of Object.entries(spriteUrls)) this.load.spritesheet(fileName(path), url, { frameWidth: 16, frameHeight: 24 });
    for (const [id, entry] of Object.entries(maps)) {
      const url = mapUrls[`../../assets/maps/${entry.file}`];
      if (!url) throw new Error(`maps.json: file not found for "${id}": ${entry.file}`);
      this.load.tilemapTiledJSON(mapCacheKey(id), url);
    }
  }

  create(): void {
    generateObjectTextures(this);
    generateShadowTexture(this, SHADOW_TEXTURE);
    this.scene.start(SceneKeys.Title);
  }
}
