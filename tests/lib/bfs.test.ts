import { describe, expect, it } from 'vitest';
import { buildWordIndex } from '../../src/lib/wordIndex';
import { shortestPath } from '../../src/lib/bfs';
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
