import Phaser from 'phaser';
import { SceneKeys } from '../config';

/** First scene: engine-level setup only, then hand off to Preload. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  create(): void {
    this.scene.start(SceneKeys.Preload);
  }
}
