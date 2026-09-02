export const DAILY_MIN_DATE = '2026-01-01';

export function getTodayDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export type DailyDateInvalidReason = 'future' | 'too-early';

export type DailyDateValidationResult =
  | { valid: true }
  | { valid: false; reason: DailyDateInvalidReason };

export function validateDailyDate(dateStr: string, today = getTodayDateString()): DailyDateValidationResult {
  if (dateStr > today) return { valid: false, reason: 'future' };
  if (dateStr < DAILY_MIN_DATE) return { valid: false, reason: 'too-early' };
  return { valid: true };
}
