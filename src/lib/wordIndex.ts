import { sortedKey } from './letterUtils';

export type WordIndex = Map<string, string[]>;

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export function buildWordIndex(words: string[]): WordIndex {
  const index: WordIndex = new Map();
  for (const word of words) {
    const key = sortedKey(word);
    const bucket = index.get(key);
    if (bucket) {
      bucket.push(word);
    } else {
      index.set(key, [word]);
    }
  }
  return index;
}

function distinctLetters(key: string): string[] {
  return [...new Set(key)];
}

function removeOneLetter(key: string, letter: string): string {
  const idx = key.indexOf(letter);
  return key.slice(0, idx) + key.slice(idx + 1);
}

export function getNeighbors(word: string, index: WordIndex): string[] {
  const key = sortedKey(word);
  const letters = distinctLetters(key);
  const results = new Set<string>();

  // Add-edges: append each possible letter, look up the length+1 bucket.
  for (const letter of ALPHABET) {
    const candidateKey = sortedKey(key + letter);
    const bucket = index.get(candidateKey);
    if (bucket) {
      for (const candidate of bucket) results.add(candidate);
    }
  }

  // Remove-edges: drop each distinct letter, look up the length-1 bucket.
  for (const letter of letters) {
    const candidateKey = removeOneLetter(key, letter);
    const bucket = index.get(candidateKey);
    if (bucket) {
      for (const candidate of bucket) results.add(candidate);
    }
  }

  // Substitute-edges: drop each distinct letter, add back a different one.
  for (const removeLetter of letters) {
    const withoutLetter = removeOneLetter(key, removeLetter);
    for (const addLetter of ALPHABET) {
      if (addLetter === removeLetter) continue;
      const candidateKey = sortedKey(withoutLetter + addLetter);
      const bucket = index.get(candidateKey);
      if (bucket) {
        for (const candidate of bucket) results.add(candidate);
      }
    }
  }

  results.delete(word);
  return [...results];
}
