interface ResultSummaryProps {
  playerLength: number;
  shortestLength: number;
}

export function ResultSummary({ playerLength, shortestLength }: ResultSummaryProps) {
  const isOptimal = playerLength === shortestLength;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-neutral-100 px-6 py-5 dark:bg-neutral-900">
      <span className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-emerald-950 shadow-lg">
        You made it! 🎉
      </span>
      <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">
        <p>
          Your path: <strong className="font-semibold">{playerLength}</strong> move
          {playerLength === 1 ? '' : 's'}
        </p>
        <p>
          Shortest possible: <strong className="font-semibold">{shortestLength}</strong> move
          {shortestLength === 1 ? '' : 's'}
        </p>
      </div>
      {isOptimal ? (
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Optimal path — nice!</p>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {playerLength - shortestLength} move{playerLength - shortestLength === 1 ? '' : 's'} more than
          optimal.
        </p>
      )}
    </div>
  );
}
