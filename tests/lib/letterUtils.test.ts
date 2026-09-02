import { describe, expect, it } from 'vitest';
import { letterDifference, sortedKey } from '../../src/lib/letterUtils';

describe('sortedKey', () => {
  it('sorts letters alphabetically', () => {
    expect(sortedKey('cat')).toBe('act');
    expect(sortedKey('act')).toBe('act');
  });
});

describe('letterDifference', () => {
  it('is zero for identical words', () => {
    expect(letterDifference('cat', 'cat')).toBe(0);
  });

  it('is zero for anagrams', () => {
    expect(letterDifference('cat', 'act')).toBe(0);
  });

  it('counts a single substitution as 2', () => {
    expect(letterDifference('cat', 'cot')).toBe(2);
  });

  it('counts length differences', () => {
    expect(letterDifference('cat', 'cats')).toBe(1);
  });

  it('counts fully disjoint words as the sum of both lengths', () => {
    expect(letterDifference('cat', 'dog')).toBe(6);
  });
});
