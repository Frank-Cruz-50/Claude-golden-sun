import Phaser from 'phaser';

/** The custom pixel font from tools/art/font.mjs (white glyphs; tint for colour). */
export const FONT_KEY = 'pixel';
export const LINE_HEIGHT = 11;

export const TextColors = {
  white: 0xffffff,
  yellow: 0xffe060,
  grey: 0xa8a8d0,
  dim: 0x6070a0,
} as const;

export interface PixelTextOptions {
  tint?: number;
  shadow?: boolean;
  scale?: number;
}

/** Bitmap text with the classic 1px drop shadow. */
export function addPixelText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  { tint = TextColors.white, shadow = true, scale = 1 }: PixelTextOptions = {},
): Phaser.GameObjects.BitmapText {
  const t = scene.add.bitmapText(x, y, FONT_KEY, text).setTint(tint).setScale(scale).setLineSpacing(LINE_HEIGHT - 10);
  // the offset is in local (pre-scale) pixels, so 1 stays one font-pixel at any scale
  if (shadow) t.setDropShadow(1, 1, 0x20203a, 1);
  return t;
}

/** Pixel width of a single line in the pixel font. */
export function measurePixelText(scene: Phaser.Scene, text: string): number {
  const data = scene.cache.bitmapFont.get(FONT_KEY).data as Phaser.Types.GameObjects.BitmapText.BitmapFontData;
  let w = 0;
  // advance = glyph width + 1px spacing (see tools/art/font.mjs)
  for (const ch of text) w += (data.chars[ch.charCodeAt(0)]?.width ?? 3) + 1;
  return Math.max(0, w - 1);
}
