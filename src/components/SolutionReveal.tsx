interface SolutionRevealProps {
  paths: string[][];
  hasMore: boolean;
  // Whether `paths` came from a full search that confirmed the count (daily
  // mode) vs. just the single BFS-found path with no uniqueness check
  // (random mode) - determines whether we can honestly say "unique".
  verified: boolean;
}

function summaryText(count: number, hasMore: boolean, verified: boolean): string {
  if (!verified) return 'Shortest solution';
  if (hasMore) return `Showing ${count} possible solutions`;
  if (count === 1) return 'Showing unique shortest solution';
  return `Showing only ${count} shortest solutions`;
}

export function SolutionReveal({ paths, hasMore, verified }: SolutionRevealProps) {
  const moves = paths[0] ? paths[0].length - 1 : 0;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {summaryText(paths.length, hasMore, verified)} ({moves} move{moves === 1 ? '' : 's'}):
      </p>
      <div className="flex flex-col items-center gap-5">
        {paths.map((path, i) => (
          <ol key={i} className="flex flex-wrap justify-center gap-2">
            {path.map((word, j) => (
              <li
                key={`${word}-${j}`}
                className="rounded-lg bg-neutral-200 px-3 py-1 font-mono text-sm dark:bg-neutral-800"
              >
                {word}
              </li>
            ))}
          </ol>
        ))}
      </div>
    </div>
  );
}
