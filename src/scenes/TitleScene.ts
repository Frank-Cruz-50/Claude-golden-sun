import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SceneKeys } from '../config';
import strings from '../data/strings.json';
import { InputManager } from '../systems/input/InputManager';
import { addPixelText, TextColors } from '../ui/pixelText';

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

    addPixelText(this, GAME_WIDTH / 2, 40, strings.title.gameTitle, { tint: TextColors.yellow, scale: 2 }).setOrigin(0.5);
    addPixelText(this, GAME_WIDTH / 2, 62, strings.title.subtitle, { tint: TextColors.grey }).setOrigin(0.5);

    const prompt = addPixelText(this, GAME_WIDTH / 2, 108, strings.title.pressStart).setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0, duration: 500, yoyo: true, repeat: -1, hold: 300 });

    addPixelText(this, GAME_WIDTH / 2, GAME_HEIGHT - 6, strings.title.footer, { tint: TextColors.dim, shadow: false }).setOrigin(0.5, 1);

    this.cameras.main.fadeIn(300);
  }

  update(): void {
    this.controls.update();
    if (this.leaving) return;
    if (this.controls.justPressed('menu') || this.controls.justPressed('confirm')) {
      this.leaving = true;
      this.cameras.main.fadeOut(300);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
        this.scene.start(SceneKeys.Field, devStartOverride()),
      );
    }
  }
}

/** Dev convenience: `?map=<id>&spawn=<name>` in the URL starts the field on that map. */
function devStartOverride(): { map?: string; spawn?: string } {
  const params = new URLSearchParams(window.location.search);
  return { map: params.get('map') ?? undefined, spawn: params.get('spawn') ?? undefined };
}
