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

// Finds up to `maxPaths` distinct shortest paths between start and goal (all
// the same length). Unlike shortestPath, this can't stop as soon as goal is
// first reached - it has to finish exploring goal's entire distance layer to
// discover every predecessor that also achieves the shortest distance.
export function shortestPaths(start: string, goal: string, index: WordIndex, maxPaths: number): string[][] {
  if (start === goal) return [[start]];

  const dist = new Map<string, number>([[start, 0]]);
  const parents = new Map<string, string[]>();
  const queue: string[] = [start];
  let head = 0;
  let goalDist = Infinity;

  while (head < queue.length) {
    const current = queue[head++];
    const currentDist = dist.get(current)!;
    // Nodes at goal's own distance can only produce goalDist+1 neighbors,
    // which are never useful for reconstructing a path to goal - skip them.
    if (currentDist >= goalDist) break;

    for (const neighbor of getNeighbors(current, index)) {
      const neighborDist = dist.get(neighbor);
      if (neighborDist === undefined) {
        dist.set(neighbor, currentDist + 1);
        parents.set(neighbor, [current]);
        queue.push(neighbor);
        if (neighbor === goal) goalDist = currentDist + 1;
      } else if (neighborDist === currentDist + 1) {
        parents.get(neighbor)!.push(current);
      }
    }
  }

  if (!dist.has(goal)) return [];

  const results: string[][] = [];
  const buildPaths = (node: string, suffix: string[]): void => {
    if (results.length >= maxPaths) return;
    const path = [node, ...suffix];
    if (node === start) {
      results.push(path);
      return;
    }
    for (const parent of parents.get(node) ?? []) {
      if (results.length >= maxPaths) return;
      buildPaths(parent, path);
    }
  };
  buildPaths(goal, []);

  return results;
}
