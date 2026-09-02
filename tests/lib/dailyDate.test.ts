import { describe, expect, it } from 'vitest';
import { DAILY_MIN_DATE, validateDailyDate } from '../../src/lib/dailyDate';

describe('validateDailyDate', () => {
  const today = '2026-09-02';

  it('accepts today', () => {
    expect(validateDailyDate(today, today)).toEqual({ valid: true });
  });

  it('accepts a past date on or after the minimum', () => {
    expect(validateDailyDate('2026-03-15', today)).toEqual({ valid: true });
    expect(validateDailyDate(DAILY_MIN_DATE, today)).toEqual({ valid: true });
  });

  it('rejects a future date', () => {
    expect(validateDailyDate('2026-09-03', today)).toEqual({ valid: false, reason: 'future' });
  });

  it('rejects a date before the minimum', () => {
    expect(validateDailyDate('2025-12-31', today)).toEqual({ valid: false, reason: 'too-early' });
  });
});
