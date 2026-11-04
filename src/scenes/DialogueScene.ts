import Phaser from 'phaser';
import { SceneKeys } from '../config';
import fieldConfig from '../data/field.json';
import { paginate } from '../systems/dialogue/paginate';
import { InputManager } from '../systems/input/InputManager';
import { TEXTBOX_LINES, TextBox } from '../ui/TextBox';

export interface DialogueLine {
  speaker?: string;
  text: string;
}

interface DialogueData {
  lines: DialogueLine[];
  onDone: () => void;
}

interface Page {
  speaker?: string;
  text: string;
}

/**
 * Overlay scene that shows dialogue pages with a typewriter effect.
 * A/B finishes the current page, then advances. Use `showDialogue()` to open it.
 */
export class DialogueScene extends Phaser.Scene {
  private controls!: InputManager;
  private box!: TextBox;
  private pages: Page[] = [];
  private pageIndex = 0;
  private shown = 0;
  private onDone: () => void = () => {};

  constructor() {
    super(SceneKeys.Dialogue);
  }

  create(data: DialogueData): void {
    this.controls = new InputManager(this);
    this.box = new TextBox(this);
    this.onDone = data.onDone;
    this.pages = data.lines.flatMap((line) =>
      paginate(line.text, this.box.maxChars, TEXTBOX_LINES).map((text) => ({ speaker: line.speaker, text })),
    );
    this.pageIndex = 0;
    this.showPage();
  }

  update(_time: number, delta: number): void {
    this.controls.update();
    const page = this.pages[this.pageIndex];
    if (!page) return;

    const complete = this.shown >= page.text.length;
    if (!complete) {
      this.shown = Math.min(page.text.length, this.shown + (fieldConfig.textCharsPerSecond * delta) / 1000);
      this.box.setText(page.text.slice(0, Math.floor(this.shown)));
      this.box.showArrow(this.shown >= page.text.length);
    }

    if (this.controls.justPressed('confirm') || this.controls.justPressed('cancel')) {
      if (!complete) {
        this.shown = page.text.length;
        this.box.setText(page.text);
        this.box.showArrow(true);
      } else if (this.pageIndex < this.pages.length - 1) {
        this.pageIndex++;
        this.showPage();
      } else {
        this.scene.stop();
        this.onDone();
      }
    }
  }

  private showPage(): void {
    const page = this.pages[this.pageIndex];
    this.shown = 0;
    this.box.setSpeaker(page.speaker);
    this.box.setText('');
    this.box.showArrow(false);
  }
}

/** Opens the dialogue overlay above `from` and resolves when it closes. */
export function showDialogue(from: Phaser.Scene, lines: DialogueLine[]): Promise<void> {
  return new Promise((resolve) => {
    if (lines.length === 0) return resolve();
    from.scene.launch(SceneKeys.Dialogue, { lines, onDone: resolve } satisfies DialogueData);
    from.scene.bringToTop(SceneKeys.Dialogue);
  });
}
