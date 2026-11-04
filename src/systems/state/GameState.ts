import { Inventory } from '../inventory/Inventory';

/** Runtime game progress (flags, items). Saving it to localStorage arrives in M10. */
export class GameState {
  readonly flags = new Set<string>();
  readonly inventory = new Inventory();

  hasFlag(flag: string): boolean {
    return this.flags.has(flag);
  }

  setFlag(flag: string): void {
    this.flags.add(flag);
  }
}

export const gameState = new GameState();
