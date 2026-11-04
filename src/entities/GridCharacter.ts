import Phaser from 'phaser';
import { TILE_SIZE } from '../config';
import { DIRECTION_DELTA, type Direction } from '../systems/field/direction';
import { charTextureKey, ensureCharTextures } from '../ui/placeholderSprites';

/**
 * A character that lives on the tile grid and steps one tile at a time with a
 * smooth tween. Shared by the player and NPCs.
 */
export class GridCharacter {
  readonly sprite: Phaser.GameObjects.Image;
  tileX: number;
  tileY: number;
  facing: Direction;
  private moving = false;
  private frame: 0 | 1 = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly color: string,
    tileX: number,
    tileY: number,
    facing: Direction,
  ) {
    ensureCharTextures(scene, color);
    this.tileX = tileX;
    this.tileY = tileY;
    this.facing = facing;
    this.sprite = scene.add.image(0, 0, charTextureKey(color, facing, 0)).setOrigin(0.5, 1);
    this.snapToTile();
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
    this.frame = this.frame === 0 ? 1 : 0;
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
        this.frame = 0;
        this.refreshTexture();
        onComplete?.();
      },
    });
  }

  snapToTile(): void {
    const p = this.pixelPosition();
    this.sprite.setPosition(p.x, p.y).setDepth(p.y);
  }

  destroy(): void {
    this.sprite.destroy();
  }

  private pixelPosition(): { x: number; y: number } {
    return { x: this.tileX * TILE_SIZE + TILE_SIZE / 2, y: (this.tileY + 1) * TILE_SIZE };
  }

  private refreshTexture(): void {
    this.sprite.setTexture(charTextureKey(this.color, this.facing, this.frame));
  }
}
