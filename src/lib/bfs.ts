import { getNeighbors, type WordIndex } from './wordIndex';

export function shortestPath(start: string, goal: string, index: WordIndex): string[] | null {
  if (start === goal) return [start];

  const visited = new Set<string>([start]);
  const parent = new Map<string, string>();
  const queue: string[] = [start];
  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];
    for (const neighbor of getNeighbors(current, index)) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      parent.set(neighbor, current);

      if (neighbor === goal) {
        const path = [goal];
        let node = goal;
        while (node !== start) {
          node = parent.get(node)!;
          path.push(node);
        }
        return path.reverse();
      }

      queue.push(neighbor);
    }
  }

  return null;
}
