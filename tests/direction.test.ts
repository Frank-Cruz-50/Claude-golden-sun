import { describe, expect, it } from 'vitest';
import { directionToward, isDirection, opposite } from '../src/systems/field/direction';

describe('direction helpers', () => {
  it('finds the direction to an adjacent tile', () => {
    expect(directionToward(5, 5, 5, 4)).toBe('up');
    expect(directionToward(5, 5, 6, 5)).toBe('right');
    expect(directionToward(5, 5, 7, 5)).toBeUndefined();
    expect(directionToward(5, 5, 6, 6)).toBeUndefined();
  });

  it('validates and reverses directions', () => {
    expect(isDirection('left')).toBe(true);
    expect(isDirection('north')).toBe(false);
    expect(opposite('up')).toBe('down');
  });
});
