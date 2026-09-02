interface DailyDatePickerProps {
  date: string;
  min: string;
  max: string;
  error: string | null;
  onChange: (date: string) => void;
}

export function DailyDatePicker({ date, min, max, error, onChange }: DailyDatePickerProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <input
        type="date"
        value={date}
        min={min}
        max={max}
        onChange={(e) => {
          if (e.target.value) onChange(e.target.value);
        }}
        className="rounded-lg bg-neutral-100 px-3 py-2 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
      />
      {error && <p className="max-w-xs text-center text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
