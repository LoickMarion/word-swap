import { describe, expect, it } from 'vitest';
import { buildWordIndex } from '../../src/lib/wordIndex';
import { shortestPath, shortestPaths } from '../../src/lib/bfs';
import { FIXTURE_WORDS } from './fixtureWords';

describe('shortestPath', () => {
  const index = buildWordIndex(FIXTURE_WORDS);

  it('returns a single-word path when start equals goal', () => {
    expect(shortestPath('cat', 'cat', index)).toEqual(['cat']);
  });

  it('finds the shortest path between two connected words', () => {
    const path = shortestPath('at', 'care', index);
    expect(path).not.toBeNull();
    expect(path![0]).toBe('at');
    expect(path![path!.length - 1]).toBe('care');
    // at -> cat|act -> car -> care is the shortest route (3 moves).
    expect(path!.length).toBe(4);
  });

  it('returns null for a goal that is unreachable / not in the index', () => {
    expect(shortestPath('at', 'zzzz', index)).toBeNull();
  });
});

describe('shortestPaths', () => {
  const index = buildWordIndex(FIXTURE_WORDS);

  it('returns a single-word path when start equals goal', () => {
    expect(shortestPaths('cat', 'cat', index, 3)).toEqual([['cat']]);
  });

  it('returns an empty array for an unreachable goal', () => {
    expect(shortestPaths('at', 'zzzz', index, 3)).toEqual([]);
  });

  it('finds every distinct shortest path when there is more than one', () => {
    // "at" -> care has exactly two shortest (3-move) routes, through the two
    // anagrams "cat" and "act" (both neighbors of "at" and of "car").
    const paths = shortestPaths('at', 'care', index, 4);
    const asStrings = paths.map((p) => p.join('>'));
    expect(new Set(asStrings)).toEqual(new Set(['at>cat>car>care', 'at>act>car>care']));
  });

  it('returns a single path when only one shortest route exists', () => {
    // "cat" -> "coat" is a direct one-move (add-edge) neighbor; there's only
    // one way to take a single hop between two specific words.
    const paths = shortestPaths('cat', 'coat', index, 4);
    expect(paths).toEqual([['cat', 'coat']]);
  });

  it('caps the number of paths returned at maxPaths', () => {
    // "at" -> "care" has exactly 2 distinct shortest routes (see above);
    // requesting only 1 should return just one of them.
    const cappedPaths = shortestPaths('at', 'care', index, 1);
    expect(cappedPaths.length).toBe(1);
    expect(cappedPaths[0][0]).toBe('at');
    expect(cappedPaths[0][cappedPaths[0].length - 1]).toBe('care');

    const uncappedPaths = shortestPaths('at', 'care', index, 4);
    expect(uncappedPaths.length).toBe(2);
  });

  it('caps at maxPaths when more than that many shortest routes exist', () => {
    // "ab" -> "abcd" has exactly 4 distinct 2-move routes: add "c" then "d"
    // (spelled either "abc" or its anagram "bac") or add "d" then "c"
    // (spelled either "abd" or its anagram "bad").
    const fanOutWords = ['ab', 'abc', 'bac', 'abd', 'bad', 'abcd'];
    const fanOutIndex = buildWordIndex(fanOutWords);

    const allPaths = shortestPaths('ab', 'abcd', fanOutIndex, 10);
    expect(allPaths.length).toBe(4);
    expect(new Set(allPaths.map((p) => p[1]))).toEqual(new Set(['abc', 'bac', 'abd', 'bad']));

    const cappedPaths = shortestPaths('ab', 'abcd', fanOutIndex, 3);
    expect(cappedPaths.length).toBe(3);
  });
});
