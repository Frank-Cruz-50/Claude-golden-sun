import { describe, expect, it } from 'vitest';
import { formatText, paginate, wrapText } from '../src/systems/dialogue/paginate';

describe('wrapText', () => {
  it('wraps on word boundaries', () => {
    expect(wrapText('the quick brown fox jumps', 10)).toEqual(['the quick', 'brown fox', 'jumps']);
  });

  it('keeps explicit newlines', () => {
    expect(wrapText('one\ntwo three', 20)).toEqual(['one', 'two three']);
  });

  it('hard-splits words longer than a line', () => {
    expect(wrapText('abcdefghij xy', 4)).toEqual(['abcd', 'efgh', 'ij', 'xy']);
  });

  it('never produces a line longer than the limit', () => {
    const text = 'Lantern Night, and the river is running cold. Never seen it cold in harvest season.';
    for (const line of wrapText(text, 13)) expect(line.length).toBeLessThanOrEqual(13);
  });
});

describe('paginate', () => {
  it('groups wrapped lines into pages', () => {
    expect(paginate('a b c d e', 1, 2)).toEqual(['a\nb', 'c\nd', 'e']);
  });

  it('returns one empty page for empty text', () => {
    expect(paginate('', 10, 3)).toEqual(['']);
  });
});

describe('formatText', () => {
  it('fills known placeholders and leaves unknown ones', () => {
    expect(formatText('Hi {player}, {missing}! x{qty}', { player: 'Wren', qty: 2 })).toBe('Hi Wren, {missing}! x2');
  });
});

describe('wrapText with a pixel measure', () => {
  // narrow letters (i, l) count 2px, everything else 6px
  const px = (s: string) => [...s].reduce((w, ch) => w + ('il '.includes(ch) ? 2 : 6), 0);

  it('wraps by measured width, not character count', () => {
    expect(wrapText('mmm ill mmm', 30, px)).toEqual(['mmm ill', 'mmm']);
  });

  it('keeps every line within the width', () => {
    for (const line of wrapText('a kind light in the old lamp shrine', 40, px)) expect(px(line)).toBeLessThanOrEqual(40);
  });

  it('hard-splits a word wider than the line', () => {
    expect(wrapText('mmmmmmmm', 24, px)).toEqual(['mmmm', 'mmmm']);
  });
});
