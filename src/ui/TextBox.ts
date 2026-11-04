import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { textStyle } from './textStyle';

const MARGIN = 4;
const PADDING = 6;
const BOX_H = 50;
export const TEXTBOX_LINES = 3;

/** Bottom-of-screen dialogue box with an optional speaker tag. Placeholder look until M3. */
export class TextBox {
  readonly maxChars: number;
  private readonly container: Phaser.GameObjects.Container;
  private readonly body: Phaser.GameObjects.Text;
  private readonly nameTag: Phaser.GameObjects.Container;
  private readonly nameText: Phaser.GameObjects.Text;
  private readonly nameBg: Phaser.GameObjects.Rectangle;
  private readonly arrow: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const boxW = GAME_WIDTH - MARGIN * 2;
    const boxY = GAME_HEIGHT - MARGIN - BOX_H;

    const bg = scene.add
      .rectangle(MARGIN, boxY, boxW, BOX_H, 0x101838, 0.94)
      .setOrigin(0)
      .setStrokeStyle(1, 0xd8d8f0);
    this.body = scene.add.text(MARGIN + PADDING, boxY + 4, '', textStyle({ lineSpacing: 1 }));
    this.arrow = scene.add.text(MARGIN + boxW - 10, boxY + BOX_H - 12, '▼', textStyle({ fontSize: '8px' }));
    scene.tweens.add({ targets: this.arrow, y: this.arrow.y + 2, duration: 300, yoyo: true, repeat: -1 });

    this.nameBg = scene.add.rectangle(0, 0, 10, 12, 0x283868).setOrigin(0).setStrokeStyle(1, 0xd8d8f0);
    this.nameText = scene.add.text(4, 1, '', textStyle({ color: '#ffe08a' }));
    this.nameTag = scene.add.container(MARGIN + 4, boxY - 11, [this.nameBg, this.nameText]);

    this.container = scene.add.container(0, 0, [bg, this.body, this.arrow, this.nameTag]);

    // Monospace: measure one glyph to know how many characters fit per line.
    const probe = scene.add.text(0, 0, 'MMMMMMMMMM', textStyle());
    const charW = probe.width / 10;
    probe.destroy();
    this.maxChars = Math.floor((boxW - PADDING * 2) / charW);
  }

  setSpeaker(name: string | undefined): void {
    this.nameTag.setVisible(Boolean(name));
    if (!name) return;
    this.nameText.setText(name);
    this.nameBg.setSize(this.nameText.width + 8, 12);
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
