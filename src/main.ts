import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './config';
import { BootScene } from './scenes/BootScene';
import { FieldScene } from './scenes/FieldScene';
import { PreloadScene } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { computeIntegerZoom } from './systems/display/integerZoom';

const parent = document.getElementById('game')!;
const zoomFor = () =>
  computeIntegerZoom(parent.clientWidth, parent.clientHeight, GAME_WIDTH, GAME_HEIGHT);

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: zoomFor(),
  },
  input: { gamepad: true },
  scene: [BootScene, PreloadScene, TitleScene, FieldScene],
});

window.addEventListener('resize', () => game.scale.setZoom(zoomFor()));

// Exposed for debugging in the browser console.
(window as unknown as { game: Phaser.Game }).game = game;
