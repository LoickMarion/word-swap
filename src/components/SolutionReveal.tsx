interface SolutionRevealProps {
  path: string[];
}

export function SolutionReveal({ path }: SolutionRevealProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Shortest solution ({path.length - 1} move{path.length - 1 === 1 ? '' : 's'}):
      </p>
      <ol className="flex flex-wrap justify-center gap-2">
        {path.map((word, i) => (
          <li
            key={`${word}-${i}`}
            className="rounded-lg bg-neutral-200 px-3 py-1 font-mono text-sm dark:bg-neutral-800"
          >
            {word}
          </li>
        ))}
      </ol>
    </div>
  );
}
