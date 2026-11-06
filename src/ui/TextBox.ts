import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, UiKeys } from '../config';
import { addPixelText, LINE_HEIGHT, measurePixelText, TextColors } from './pixelText';

const MARGIN = 4;
const PADDING_X = 8;
const PADDING_Y = 6;
const BOX_W = GAME_WIDTH - MARGIN * 2; // matches assets/ui/textbox.png
const BOX_H = 50;
export const TEXTBOX_LINES = 3;

/** Bottom-of-screen dialogue window with an optional speaker tag. */
export class TextBox {
  readonly maxWidth = BOX_W - PADDING_X * 2;
  private readonly container: Phaser.GameObjects.Container;
  private readonly body: Phaser.GameObjects.BitmapText;
  private readonly nameTag: Phaser.GameObjects.Container;
  private readonly nameText: Phaser.GameObjects.BitmapText;
  private readonly nameBg: Phaser.GameObjects.NineSlice;
  private readonly arrow: Phaser.GameObjects.BitmapText;

  constructor(private readonly scene: Phaser.Scene) {
    const boxY = GAME_HEIGHT - MARGIN - BOX_H;
    const bg = scene.add.image(MARGIN, boxY, UiKeys.TextBox).setOrigin(0);
    this.body = addPixelText(scene, MARGIN + PADDING_X, boxY + PADDING_Y, '');
    this.arrow = addPixelText(scene, MARGIN + BOX_W - 12, boxY + BOX_H - 12, 'v', { tint: TextColors.yellow });
    scene.tweens.add({ targets: this.arrow, y: this.arrow.y + 2, duration: 300, yoyo: true, repeat: -1 });

    this.nameBg = scene.add.nineslice(0, 0, UiKeys.Window9, undefined, 40, 15, 4, 4, 4, 4).setOrigin(0);
    this.nameText = addPixelText(scene, 6, 3, '', { tint: TextColors.yellow });
    this.nameTag = scene.add.container(MARGIN + 6, boxY - 13, [this.nameBg, this.nameText]);

    this.container = scene.add.container(0, 0, [bg, this.body, this.arrow, this.nameTag]);
  }

  /** Measures a line in pixels, for word-wrapping. */
  measure = (text: string): number => measurePixelText(this.scene, text);

  setSpeaker(name: string | undefined): void {
    this.nameTag.setVisible(Boolean(name));
    if (!name) return;
    this.nameText.setText(name);
    this.nameBg.setSize(this.measure(name) + 13, 15);
  }

  setText(text: string): void {
    this.body.setText(text);
  }

  showArrow(visible: boolean): void {
    this.arrow.setVisible(visible);
  }

  destroy(): void {
    this.container.destroy();
  }
}

export { LINE_HEIGHT };
