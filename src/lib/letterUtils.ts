export function sortedKey(word: string): string {
  return [...word].sort().join('');
}

export function letterDifference(a: string, b: string): number {
  const countsA = new Array(26).fill(0);
  const countsB = new Array(26).fill(0);
  const base = 'a'.charCodeAt(0);

  for (const ch of a) countsA[ch.charCodeAt(0) - base]++;
  for (const ch of b) countsB[ch.charCodeAt(0) - base]++;

  let diff = 0;
  for (let i = 0; i < 26; i++) {
    diff += Math.abs(countsA[i] - countsB[i]);
  }
  return diff;
}
