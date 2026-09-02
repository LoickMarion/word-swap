import { letterDifference } from './letterUtils';
import { getNeighbors, type WordIndex } from './wordIndex';
import { shortestPath } from './bfs';
import type { Rng } from './rng';

export type { Rng };

export interface Puzzle {
  start: string;
  goal: string;
  shortestPathWords: string[];
  shortestLength: number;
}

const WALK_LENGTH_LAMBDA = 7;
const WALKS_PER_ATTEMPT = 10;
const MAX_WALK_ATTEMPTS = 10;
const MAX_START_ATTEMPTS = 20;

// Puzzles with a shortest path shorter than this feel trivial (solved in one
// or two guesses), so candidates below the floor are skipped in favor of the
// next-best-scoring one.
export const MIN_PATH_LENGTH = 3;

function pickRandom<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

// Knuth's algorithm: sample from a Poisson distribution with the given mean.
export function samplePoisson(lambda: number, rng: Rng): number {
  const limit = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > limit);
  return k - 1;
}

export function randomWalk(start: string, steps: number, index: WordIndex, rng: Rng): string[] {
  const visited = [start];
  let current = start;

  for (let i = 0; i < steps; i++) {
    const neighbors = getNeighbors(current, index);
    if (neighbors.length === 0) break;
    current = pickRandom(neighbors, rng);
    visited.push(current);
  }

  return visited;
}

export function generatePuzzle(
  commonWords: string[],
  index: WordIndex,
  rng: Rng,
  minPathLength: number = MIN_PATH_LENGTH,
): Puzzle {
  const commonWordsSet = new Set(commonWords);

  for (let startAttempt = 0; startAttempt < MAX_START_ATTEMPTS; startAttempt++) {
    const start = pickRandom(commonWords, rng);

    for (let walkAttempt = 0; walkAttempt < MAX_WALK_ATTEMPTS; walkAttempt++) {
      const visited = new Set<string>();
      for (let w = 0; w < WALKS_PER_ATTEMPT; w++) {
        const steps = samplePoisson(WALK_LENGTH_LAMBDA, rng);
        for (const word of randomWalk(start, steps, index, rng)) {
          visited.add(word);
        }
      }
      visited.delete(start);

      const candidates = [...visited]
        .filter((word) => commonWordsSet.has(word))
        .map((word) => ({ word, score: letterDifference(start, word), tiebreak: rng() }))
        .sort((a, b) => b.score - a.score || b.tiebreak - a.tiebreak);

      for (const { word: candidateGoal } of candidates) {
        const path = shortestPath(start, candidateGoal, index);
        if (path && path.length - 1 >= minPathLength) {
          return {
            start,
            goal: candidateGoal,
            shortestPathWords: path,
            shortestLength: path.length - 1,
          };
        }
      }
    }
  }

  throw new Error('Could not generate a solvable puzzle after multiple attempts. Please try again.');
}
