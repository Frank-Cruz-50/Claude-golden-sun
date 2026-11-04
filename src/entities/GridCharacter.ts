import Phaser from 'phaser';
import { TILE_SIZE } from '../config';
import { DIRECTION_DELTA, type Direction } from '../systems/field/direction';
import { charTextureKey, ensureCharTextures } from '../ui/placeholderSprites';

/** How a character is drawn: a sprite sheet from /assets/sprites, or a code-drawn placeholder colour. */
export type Appearance = { sheet: string } | { color: string };

/** Sprite sheets are 3 frames (stand, stepA, stepB) x 4 rows in this order. */
const SHEET_ROWS: Record<Direction, number> = { down: 0, left: 1, right: 2, up: 3 };
export const SHADOW_TEXTURE = 'char-shadow';

/**
 * A character that lives on the tile grid and steps one tile at a time with a
 * smooth tween. Shared by the player and NPCs.
 */
export class GridCharacter {
  readonly sprite: Phaser.GameObjects.Image;
  private readonly shadow: Phaser.GameObjects.Image;
  tileX: number;
  tileY: number;
  facing: Direction;
  private moving = false;
  /** Which foot leads on the current step; alternates each step. */
  private stepFrame: 1 | 2 = 2;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly appearance: Appearance,
    tileX: number,
    tileY: number,
    facing: Direction,
  ) {
    if ('color' in appearance) ensureCharTextures(scene, appearance.color);
    this.tileX = tileX;
    this.tileY = tileY;
    this.facing = facing;
    this.shadow = scene.add.image(0, 0, SHADOW_TEXTURE).setOrigin(0.5, 0.5);
    this.sprite = scene.add.image(0, 0, '__DEFAULT').setOrigin(0.5, 1);
    this.refreshTexture();
    this.snapToTile();
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.syncShadow, this);
  }

  get isMoving(): boolean {
    return this.moving;
  }

  face(dir: Direction): void {
    this.facing = dir;
    this.refreshTexture();
  }

  /** The tile directly in front of this character. */
  facingTile(): { x: number; y: number } {
    const d = DIRECTION_DELTA[this.facing];
    return { x: this.tileX + d.x, y: this.tileY + d.y };
  }

  /**
   * Starts a one-tile step. The logical tile changes immediately (so others
   * can't step into it); the sprite catches up over `durationMs`.
   */
  step(dir: Direction, durationMs: number, onComplete?: () => void): void {
    if (this.moving) return;
    this.face(dir);
    const d = DIRECTION_DELTA[dir];
    this.tileX += d.x;
    this.tileY += d.y;
    this.moving = true;
    this.stepFrame = this.stepFrame === 1 ? 2 : 1;
    this.refreshTexture();
    const target = this.pixelPosition();
    this.scene.tweens.add({
      targets: this.sprite,
      x: target.x,
      y: target.y,
      duration: durationMs,
      onUpdate: () => this.sprite.setDepth(this.sprite.y),
      onComplete: () => {
        this.moving = false;
        this.refreshTexture();
        onComplete?.();
      },
    });
  }

  snapToTile(): void {
    const p = this.pixelPosition();
    this.sprite.setPosition(p.x, p.y).setDepth(p.y);
    this.syncShadow();
  }

  destroy(): void {
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.syncShadow, this);
    this.sprite.destroy();
    this.shadow.destroy();
  }

  private syncShadow(): void {
    this.shadow.setPosition(this.sprite.x, this.sprite.y - 2).setDepth(this.sprite.depth - 0.5);
  }

  private pixelPosition(): { x: number; y: number } {
    return { x: this.tileX * TILE_SIZE + TILE_SIZE / 2, y: (this.tileY + 1) * TILE_SIZE };
  }

  private refreshTexture(): void {
    const frame = this.moving ? this.stepFrame : 0;
    if ('sheet' in this.appearance) this.sprite.setTexture(this.appearance.sheet, SHEET_ROWS[this.facing] * 3 + frame);
    else this.sprite.setTexture(charTextureKey(this.appearance.color, this.facing, frame === 0 ? 0 : 1));
  }
}
