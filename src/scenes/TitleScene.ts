import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SceneKeys } from '../config';
import strings from '../data/strings.json';
import { InputManager } from '../systems/input/InputManager';
import { textStyle } from '../ui/textStyle';

export class TitleScene extends Phaser.Scene {
  private controls!: InputManager;
  private leaving = false;

  constructor() {
    super(SceneKeys.Title);
  }

  create(): void {
    this.leaving = false;
    this.controls = new InputManager(this);
    this.cameras.main.setBackgroundColor('#101830');

    this.add
      .text(GAME_WIDTH / 2, 44, strings.title.gameTitle, textStyle({ fontSize: '16px', color: '#ffe08a' }))
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 62, strings.title.subtitle, textStyle({ color: '#c0c8e0' }))
      .setOrigin(0.5);

    const prompt = this.add
      .text(GAME_WIDTH / 2, 108, strings.title.pressStart, textStyle())
      .setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0, duration: 500, yoyo: true, repeat: -1, hold: 300 });

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 8, strings.title.footer, textStyle({ fontSize: '8px', color: '#6070a0' }))
      .setOrigin(0.5, 1);

    this.cameras.main.fadeIn(300);
  }

  update(): void {
    this.controls.update();
    if (this.leaving) return;
    if (this.controls.justPressed('menu') || this.controls.justPressed('confirm')) {
      this.leaving = true;
      this.cameras.main.fadeOut(300);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
        this.scene.start(SceneKeys.Field),
      );
    }
  }
}
