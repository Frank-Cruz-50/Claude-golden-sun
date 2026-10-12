import type Phaser from 'phaser';

/** Placeholder text style until a bitmap font is chosen in M3. */
export function textStyle(
  overrides: Phaser.Types.GameObjects.Text.TextStyle = {},
): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: 'monospace',
    fontSize: '10px',
    color: '#ffffff',
    ...overrides,
  };
}
