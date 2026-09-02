interface HintRevealProps {
  words: string[];
}

export function HintReveal({ words }: HintRevealProps) {
  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No legal moves from here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Possible next moves:</p>
      <ol className="flex flex-wrap justify-center gap-2">
        {words.map((word) => (
          <li
            key={word}
            className="rounded-lg bg-neutral-200 px-3 py-1 font-mono text-sm dark:bg-neutral-800"
          >
            {word}
          </li>
        ))}
      </ol>
    </div>
  );
}
