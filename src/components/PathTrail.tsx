interface PathTrailProps {
  path: string[];
}

export function PathTrail({ path }: PathTrailProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {path.length - 1} move{path.length - 1 === 1 ? '' : 's'} so far
      </p>
      <ol className="flex flex-wrap justify-center gap-2">
        {path.map((word, i) => (
          <li
            key={`${word}-${i}`}
            className="rounded-lg bg-neutral-100 px-3 py-1 font-mono text-sm dark:bg-neutral-900"
          >
            {word}
          </li>
        ))}
      </ol>
    </div>
  );
}
