interface UndoButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function UndoButton({ onClick, disabled }: UndoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-30 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:active:bg-neutral-700"
    >
      Undo
    </button>
  );
}
