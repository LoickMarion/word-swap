import { sortedKey } from './letterUtils';
import { getNeighbors, type WordIndex } from './wordIndex';

export type MoveInvalidReason = 'same-word' | 'not-a-word' | 'not-adjacent';

export type MoveValidationResult =
  | { valid: true }
  | { valid: false; reason: MoveInvalidReason };

export function validateMove(
  current: string,
  next: string,
  validWordsSet: Set<string>,
  index: WordIndex,
): MoveValidationResult {
  if (next === current || sortedKey(next) === sortedKey(current)) {
    return { valid: false, reason: 'same-word' };
  }

  if (!validWordsSet.has(next)) {
    return { valid: false, reason: 'not-a-word' };
  }

  const neighbors = getNeighbors(current, index);
  if (!neighbors.includes(next)) {
    return { valid: false, reason: 'not-adjacent' };
  }

  return { valid: true };
}
