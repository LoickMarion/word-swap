import { describe, expect, it } from 'vitest';
import { buildWordIndex, getNeighbors } from '../../src/lib/wordIndex';
import { FIXTURE_WORDS } from './fixtureWords';

describe('buildWordIndex', () => {
  it('groups anagrams under the same key', () => {
    const index = buildWordIndex(FIXTURE_WORDS);
    const bucket = index.get('act');
    expect(bucket).toBeDefined();
    expect(new Set(bucket)).toEqual(new Set(['cat', 'act']));
  });
});

describe('getNeighbors', () => {
  const index = buildWordIndex(FIXTURE_WORDS);

  it('finds add/remove/substitute neighbors of "cat"', () => {
    const neighbors = new Set(getNeighbors('cat', index));
    expect(neighbors).toEqual(new Set(['cats', 'coat', 'at', 'cot', 'car']));
  });

  it('excludes the pure anagram "act" from the neighbors of "cat"', () => {
    const neighbors = getNeighbors('cat', index);
    expect(neighbors).not.toContain('act');
  });

  it('finds neighbors of "at"', () => {
    const neighbors = new Set(getNeighbors('at', index));
    expect(neighbors).toEqual(new Set(['cat', 'act']));
  });

  it('finds neighbors of "car" including "care" via an add-edge', () => {
    const neighbors = getNeighbors('car', index);
    expect(neighbors).toContain('care');
    expect(neighbors).toContain('cat');
  });

  it('returns an empty array for a word with no neighbors in the index', () => {
    expect(getNeighbors('coat', index)).toEqual(expect.arrayContaining(['cat', 'cats']));
  });
});
