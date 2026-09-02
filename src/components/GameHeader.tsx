interface GameHeaderProps {
  start: string;
  goal: string;
  currentWord: string;
}

function WordBadge({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div
      className={`flex min-w-[100px] flex-col items-center gap-1 rounded-xl px-4 py-3 ${
        active
          ? 'bg-emerald-500/10 ring-2 ring-emerald-500'
          : 'bg-neutral-100 dark:bg-neutral-900'
      }`}
    >
      <span className="text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
        {label}
      </span>
      <span className="font-mono text-lg font-semibold tracking-tight">{value}</span>
    </div>
  );
}

export function GameHeader({ start, goal, currentWord }: GameHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <WordBadge label="Start" value={start} />
      <span className="text-neutral-400 dark:text-neutral-600" aria-hidden="true">
        →
      </span>
      <WordBadge label="Current" value={currentWord} active />
      <span className="text-neutral-400 dark:text-neutral-600" aria-hidden="true">
        →
      </span>
      <WordBadge label="Goal" value={goal} />
    </div>
  );
}
