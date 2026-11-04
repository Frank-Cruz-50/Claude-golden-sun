export const MAX_STACK = 99;

/** Item id → quantity. Pure logic; item definitions live in /src/data/items.json. */
export class Inventory {
  private readonly items = new Map<string, number>();

  count(itemId: string): number {
    return this.items.get(itemId) ?? 0;
  }

  /** Adds up to MAX_STACK; returns how many were actually added. */
  add(itemId: string, qty = 1): number {
    if (!Number.isInteger(qty) || qty < 1) throw new Error(`Invalid quantity ${qty}`);
    const current = this.count(itemId);
    const added = Math.min(qty, MAX_STACK - current);
    if (added > 0) this.items.set(itemId, current + added);
    return added;
  }

  /** Removes items; returns false (and changes nothing) if there aren't enough. */
  remove(itemId: string, qty = 1): boolean {
    const current = this.count(itemId);
    if (!Number.isInteger(qty) || qty < 1 || current < qty) return false;
    if (current === qty) this.items.delete(itemId);
    else this.items.set(itemId, current - qty);
    return true;
  }

  entries(): [string, number][] {
    return [...this.items.entries()];
  }
}
