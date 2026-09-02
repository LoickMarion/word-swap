import { describe, expect, it } from 'vitest';
import { buildWordIndex } from '../../src/lib/wordIndex';
import { getHintWords } from '../../src/lib/hint';
import { FIXTURE_WORDS } from './fixtureWords';

describe('getHintWords', () => {
  const index = buildWordIndex(FIXTURE_WORDS);

  it('only suggests legal one-move neighbors of the current word', () => {
    const hints = getHintWords('cat', 'care', index, 3);
    const legalNeighbors = new Set(['cats', 'coat', 'at', 'cot', 'car']);
    for (const hint of hints) {
      expect(legalNeighbors.has(hint)).toBe(true);
    }
  });

  it('ranks suggestions by closeness to the goal', () => {
    const hints = getHintWords('cat', 'care', index, 3);
    // "car" shares the most letters with "care" among cat's neighbors, so it
    // should be suggested first.
    expect(hints[0]).toBe('car');
  });

  it('caps suggestions at the requested count', () => {
    const hints = getHintWords('cat', 'care', index, 2);
    expect(hints.length).toBeLessThanOrEqual(2);
  });

  it('returns an empty array when there are no legal moves', () => {
    const isolatedIndex = buildWordIndex(['xyz']);
    expect(getHintWords('xyz', 'xyz', isolatedIndex, 3)).toEqual([]);
  });
});
