import { describe, expect, it } from 'vitest';
import { Inventory, MAX_STACK } from '../src/systems/inventory/Inventory';

describe('Inventory', () => {
  it('adds and counts items', () => {
    const inv = new Inventory();
    expect(inv.add('herb', 2)).toBe(2);
    inv.add('herb');
    expect(inv.count('herb')).toBe(3);
    expect(inv.count('nothing')).toBe(0);
  });

  it('caps stacks and reports how many were added', () => {
    const inv = new Inventory();
    inv.add('herb', MAX_STACK - 1);
    expect(inv.add('herb', 5)).toBe(1);
    expect(inv.add('herb')).toBe(0);
    expect(inv.count('herb')).toBe(MAX_STACK);
  });

  it('removes only when there are enough', () => {
    const inv = new Inventory();
    inv.add('herb', 2);
    expect(inv.remove('herb', 3)).toBe(false);
    expect(inv.remove('herb', 2)).toBe(true);
    expect(inv.count('herb')).toBe(0);
    expect(inv.entries()).toEqual([]);
  });

  it('rejects invalid quantities', () => {
    const inv = new Inventory();
    expect(() => inv.add('herb', 0)).toThrow();
    expect(inv.remove('herb', -1)).toBe(false);
  });
});
