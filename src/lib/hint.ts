import { letterDifference } from './letterUtils';
import { getNeighbors, type WordIndex } from './wordIndex';

// Suggests legal next moves from `current`, ranked by how much closer (in
// letter-composition terms) each one gets you to `goal`. Cheap heuristic -
// reuses the same letterDifference scoring the puzzle generator uses - rather
// than running a fresh BFS on every hint click.
export function getHintWords(current: string, goal: string, index: WordIndex, count = 3): string[] {
  return getNeighbors(current, index)
    .map((word) => ({ word, distance: letterDifference(word, goal) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map(({ word }) => word);
}
