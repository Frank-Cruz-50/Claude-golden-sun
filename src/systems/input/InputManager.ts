import Phaser from 'phaser';
import bindings from '../../data/input.json';
import { ACTIONS, ActionState, type Action } from './actionState';

type KeyBindings = Record<Action, string[]>;
type PadBindings = Partial<Record<Action, number[]>>;

/**
 * Unifies keyboard and gamepad into named actions (A = confirm, B = cancel,
 * Start = menu, L/R = field ability shortcuts). Create one per scene and call
 * `update()` at the top of the scene's update loop.
 */
export class InputManager {
  private readonly state = new ActionState();
  private readonly keys = new Map<Action, Phaser.Input.Keyboard.Key[]>();
  private readonly actionsByKeyCode = new Map<number, Action[]>();
  /** Actions pressed since the last update, so sub-frame taps are not lost. */
  private readonly pending = new Set<Action>();

  constructor(private readonly scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;
    const keyBindings = bindings.keyboard as KeyBindings;
    const codes = Phaser.Input.Keyboard.KeyCodes as unknown as Record<string, number>;

    for (const action of ACTIONS) {
      const names = keyBindings[action] ?? [];
      this.keys.set(action, keyboard ? names.map((n) => keyboard.addKey(n, true, false)) : []);
      for (const name of names) {
        const code = codes[name];
        if (code === undefined) continue;
        const list = this.actionsByKeyCode.get(code) ?? [];
        list.push(action);
        this.actionsByKeyCode.set(code, list);
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      for (const action of this.actionsByKeyCode.get(event.keyCode) ?? []) this.pending.add(action);
    };
    keyboard?.on('keydown', onKeyDown);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => keyboard?.off('keydown', onKeyDown));
  }

  update(): void {
    const held: Action[] = [];
    const tapped = new Set(this.pending);
    this.pending.clear();

    const pad = this.activePad();
    const padButtons = bindings.gamepad.buttons as PadBindings;
    const deadzone = bindings.gamepad.stickDeadzone;

    for (const action of ACTIONS) {
      let down = this.keys.get(action)?.some((k) => k.isDown) ?? false;
      if (!down && pad) {
        down = (padButtons[action] ?? []).some((i) => pad.buttons[i]?.pressed ?? false);
        if (!down) {
          const { x, y } = pad.leftStick;
          down =
            (action === 'left' && x < -deadzone) ||
            (action === 'right' && x > deadzone) ||
            (action === 'up' && y < -deadzone) ||
            (action === 'down' && y > deadzone);
        }
      }
      if (down) held.push(action);
    }
    this.state.step(held, tapped);
  }

  isDown(action: Action): boolean {
    return this.state.isDown(action);
  }

  justPressed(action: Action): boolean {
    return this.state.justPressed(action);
  }

  private activePad(): Phaser.Input.Gamepad.Gamepad | undefined {
    const gp = this.scene.input.gamepad;
    if (!gp || gp.total === 0) return undefined;
    return gp.getAll().find((p) => p.connected);
  }
}
