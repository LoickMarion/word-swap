interface NewGameButtonProps {
  onClick: () => void;
}

export function NewGameButton({ onClick }: NewGameButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:active:bg-neutral-700"
    >
      New Game
    </button>
  );
}
