/** Pure edge-detection for named input actions. No Phaser dependency. */
export const ACTIONS = [
  'up',
  'down',
  'left',
  'right',
  'confirm',
  'cancel',
  'menu',
  'run',
  'abilityL',
  'abilityR',
] as const;

export type Action = (typeof ACTIONS)[number];

export class ActionState {
  private current = new Set<Action>();
  private previous = new Set<Action>();
  private tapped = new Set<Action>();

  /**
   * Feed the actions held this frame, plus any pressed since the last frame
   * (so a tap that was released before this frame still registers).
   * Call exactly once per frame.
   */
  step(held: Iterable<Action>, pressedSinceLastStep: Iterable<Action> = []): void {
    this.previous = this.current;
    this.current = new Set(held);
    this.tapped = new Set(pressedSinceLastStep);
  }

  isDown(action: Action): boolean {
    return this.current.has(action);
  }

  justPressed(action: Action): boolean {
    return this.tapped.has(action) || (this.current.has(action) && !this.previous.has(action));
  }

  justReleased(action: Action): boolean {
    return !this.current.has(action) && this.previous.has(action);
  }
}
