import Phaser from 'phaser';
import { GAME_WIDTH, SceneKeys, TextureKeys, TILE_SIZE } from '../config';
import strings from '../data/strings.json';
import { InputManager } from '../systems/input/InputManager';
import { textStyle } from '../ui/textStyle';

/**
 * M0 placeholder field: a procedurally checkered area and a free-moving
 * placeholder character so input, scaling, and camera can be verified.
 * Tiled maps and grid movement arrive in M2.
 */
const AREA_TILES_W = 30;
const AREA_TILES_H = 20;
const WALK_SPEED = 60; // px/s
const RUN_SPEED = 110;

export class FieldScene extends Phaser.Scene {
  private controls!: InputManager;
  private player!: Phaser.GameObjects.Image;
  private leaving = false;

  constructor() {
    super(SceneKeys.Field);
  }

  create(): void {
    this.leaving = false;
    this.controls = new InputManager(this);

    for (let y = 0; y < AREA_TILES_H; y++) {
      for (let x = 0; x < AREA_TILES_W; x++) {
        const key = (x + y) % 2 === 0 ? TextureKeys.Ground : TextureKeys.GroundAlt;
        this.add.image(x * TILE_SIZE, y * TILE_SIZE, key).setOrigin(0);
      }
    }

    const worldW = AREA_TILES_W * TILE_SIZE;
    const worldH = AREA_TILES_H * TILE_SIZE;
    this.player = this.add.image(worldW / 2, worldH / 2, TextureKeys.Player).setOrigin(0.5, 1);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, worldW, worldH);
    cam.startFollow(this.player, true);
    cam.fadeIn(300);

    this.add
      .text(4, 4, strings.field.placeholderLabel, textStyle({ fontSize: '8px', backgroundColor: '#000000a0' }))
      .setScrollFactor(0);
    this.add
      .text(GAME_WIDTH - 4, 4, strings.field.hint, textStyle({ fontSize: '8px', backgroundColor: '#000000a0' }))
      .setOrigin(1, 0)
      .setScrollFactor(0);
  }

  update(_time: number, delta: number): void {
    this.controls.update();
    if (this.leaving) return;

    if (this.controls.justPressed('menu')) {
      this.leaving = true;
      this.cameras.main.fadeOut(300);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
        this.scene.start(SceneKeys.Title),
      );
      return;
    }

    let dx = 0;
    let dy = 0;
    if (this.controls.isDown('left')) dx = -1;
    else if (this.controls.isDown('right')) dx = 1;
    else if (this.controls.isDown('up')) dy = -1;
    else if (this.controls.isDown('down')) dy = 1;

    const speed = this.controls.isDown('run') ? RUN_SPEED : WALK_SPEED;
    const step = (speed * delta) / 1000;
    const half = this.player.width / 2;
    this.player.x = Phaser.Math.Clamp(this.player.x + dx * step, half, AREA_TILES_W * TILE_SIZE - half);
    this.player.y = Phaser.Math.Clamp(this.player.y + dy * step, this.player.height, AREA_TILES_H * TILE_SIZE);
  }
}
