import { describe, expect, it } from 'vitest';
import { computeIntegerZoom } from '../src/systems/display/integerZoom';

describe('computeIntegerZoom', () => {
  it('picks the largest whole zoom that fits', () => {
    expect(computeIntegerZoom(1920, 1080, 240, 160)).toBe(6);
    expect(computeIntegerZoom(1280, 720, 240, 160)).toBe(4);
    expect(computeIntegerZoom(480, 320, 240, 160)).toBe(2);
  });

  it('is limited by the tighter axis', () => {
    expect(computeIntegerZoom(2000, 330, 240, 160)).toBe(2);
  });

  it('never goes below 1', () => {
    expect(computeIntegerZoom(100, 100, 240, 160)).toBe(1);
    expect(computeIntegerZoom(0, 0, 240, 160)).toBe(1);
  });
});
