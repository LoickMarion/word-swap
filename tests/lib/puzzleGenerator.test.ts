import { describe, expect, it } from 'vitest';
import { buildWordIndex } from '../../src/lib/wordIndex';
import { generatePuzzle, randomWalk, samplePoisson } from '../../src/lib/puzzleGenerator';
import { shortestPath } from '../../src/lib/bfs';
import { mulberry32 } from '../../src/lib/rng';
import { FIXTURE_WORDS } from './fixtureWords';

describe('randomWalk', () => {
  it('is deterministic given a seeded rng', () => {
    const index = buildWordIndex(FIXTURE_WORDS);
    const walkA = randomWalk('cat', 10, index, mulberry32(42));
    const walkB = randomWalk('cat', 10, index, mulberry32(42));
    expect(walkA).toEqual(walkB);
  });

  it('starts with the given start word', () => {
    const index = buildWordIndex(FIXTURE_WORDS);
    const walk = randomWalk('cat', 10, index, mulberry32(1));
    expect(walk[0]).toBe('cat');
  });
});

describe('samplePoisson', () => {
  it('is deterministic given a seeded rng', () => {
    const rng = mulberry32(3);
    const rngCopy = mulberry32(3);
    expect(samplePoisson(7, rng)).toBe(samplePoisson(7, rngCopy));
  });

  it('never returns a negative count', () => {
    const rng = mulberry32(9);
    for (let i = 0; i < 1000; i++) {
      expect(samplePoisson(7, rng)).toBeGreaterThanOrEqual(0);
    }
  });

  it('averages close to lambda over many samples', () => {
    const rng = mulberry32(123);
    const n = 5000;
    let total = 0;
    for (let i = 0; i < n; i++) total += samplePoisson(7, rng);
    const mean = total / n;
    expect(mean).toBeGreaterThan(6);
    expect(mean).toBeLessThan(8);
  });
});

describe('generatePuzzle', () => {
  const index = buildWordIndex(FIXTURE_WORDS);
  const commonWords = ['cat', 'care', 'coat'];

  it('produces a start and goal that are different common words', () => {
    const puzzle = generatePuzzle(commonWords, index, mulberry32(7));
    expect(commonWords).toContain(puzzle.start);
    expect(commonWords).toContain(puzzle.goal);
    expect(puzzle.start).not.toBe(puzzle.goal);
  });

  it('finds a shortest path that matches an independent BFS run', () => {
    const puzzle = generatePuzzle(commonWords, index, mulberry32(7));
    const independentPath = shortestPath(puzzle.start, puzzle.goal, index);
    expect(independentPath).not.toBeNull();
    expect(puzzle.shortestLength).toBe(independentPath!.length - 1);
    expect(puzzle.shortestPathWords).toEqual(independentPath);
  });

  it('always returns a solvable puzzle across many seeds', () => {
    for (let seed = 0; seed < 20; seed++) {
      const puzzle = generatePuzzle(commonWords, index, mulberry32(seed));
      expect(puzzle.shortestLength).toBeGreaterThan(0);
    }
  });

  it('is fully deterministic for a given seed (as used for daily puzzles)', () => {
    const puzzleA = generatePuzzle(commonWords, index, mulberry32(99));
    const puzzleB = generatePuzzle(commonWords, index, mulberry32(99));
    expect(puzzleA).toEqual(puzzleB);
  });
});
