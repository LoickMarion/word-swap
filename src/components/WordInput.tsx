import { useState, type FormEvent } from 'react';
import type { MoveInvalidReason } from '../lib/moveValidation';

const ERROR_MESSAGES: Record<MoveInvalidReason, string> = {
  'same-word': "That's the same letters as your current word — try adding, removing, or swapping a letter.",
  'not-a-word': "That's not a word in the dictionary.",
  'not-adjacent': 'That word is too different — only one added, removed, or swapped letter is allowed per move.',
};

interface WordInputProps {
  disabled: boolean;
  error: MoveInvalidReason | null;
  onSubmit: (word: string) => void;
  onClearError: () => void;
}

export function WordInput({ disabled, error, onSubmit, onClearError }: WordInputProps) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const word = value.trim();
    if (!word) return;
    onSubmit(word);
    setValue('');
  }

  return (
    <form className="flex w-full flex-col items-center gap-2" onSubmit={handleSubmit}>
      <div className="flex w-full max-w-xs gap-2">
        <input
          type="text"
          value={value}
          disabled={disabled}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Enter your next word…"
          className="w-full rounded-lg bg-neutral-100 px-3 py-2 text-center font-mono text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
          onChange={(e) => {
            setValue(e.target.value);
            if (error) onClearError();
          }}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-lg bg-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-30 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:active:bg-neutral-700"
        >
          Submit
        </button>
      </div>
      {error && <p className="max-w-xs text-center text-sm text-red-500 dark:text-red-400">{ERROR_MESSAGES[error]}</p>}
    </form>
  );
}
