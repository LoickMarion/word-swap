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

export function generatePuzzle(commonWords: string[], index: WordIndex, rng: Rng): Puzzle {
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

      const candidates = [...visited].filter((word) => commonWordsSet.has(word));
      if (candidates.length === 0) continue;

      let bestGoal = candidates[0];
      let bestScore = letterDifference(start, bestGoal);
      for (const candidate of candidates.slice(1)) {
        const score = letterDifference(start, candidate);
        if (score > bestScore || (score === bestScore && rng() < 0.5)) {
          bestGoal = candidate;
          bestScore = score;
        }
      }

      const path = shortestPath(start, bestGoal, index);
      if (path) {
        return {
          start,
          goal: bestGoal,
          shortestPathWords: path,
          shortestLength: path.length - 1,
        };
      }
    }
  }

  throw new Error('Could not generate a solvable puzzle after multiple attempts. Please try again.');
}
