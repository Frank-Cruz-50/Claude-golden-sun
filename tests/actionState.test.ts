import { describe, expect, it } from 'vitest';
import { ActionState } from '../src/systems/input/actionState';

describe('ActionState', () => {
  it('reports justPressed only on the first held frame', () => {
    const s = new ActionState();
    s.step(['confirm']);
    expect(s.justPressed('confirm')).toBe(true);
    s.step(['confirm']);
    expect(s.justPressed('confirm')).toBe(false);
    expect(s.isDown('confirm')).toBe(true);
  });

  it('reports justReleased on the frame after release', () => {
    const s = new ActionState();
    s.step(['cancel']);
    s.step([]);
    expect(s.justReleased('cancel')).toBe(true);
    expect(s.isDown('cancel')).toBe(false);
  });
});

describe('ActionState taps', () => {
  it('counts a press released before the frame as justPressed', () => {
    const s = new ActionState();
    s.step([], ['menu']);
    expect(s.justPressed('menu')).toBe(true);
    expect(s.isDown('menu')).toBe(false);
    s.step([]);
    expect(s.justPressed('menu')).toBe(false);
  });
});
