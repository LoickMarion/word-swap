import type { GameMode } from '../hooks/useGame';

interface ModeToggleProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

const MODES: { value: GameMode; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'random', label: 'Random' },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            mode === value
              ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
