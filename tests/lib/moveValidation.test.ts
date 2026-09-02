import { describe, expect, it } from 'vitest';
import { buildWordIndex } from '../../src/lib/wordIndex';
import { validateMove } from '../../src/lib/moveValidation';
import { FIXTURE_WORDS } from './fixtureWords';

describe('validateMove', () => {
  const index = buildWordIndex(FIXTURE_WORDS);
  const validWordsSet = new Set(FIXTURE_WORDS);

  it('rejects submitting the exact same word', () => {
    expect(validateMove('cat', 'cat', validWordsSet, index)).toEqual({
      valid: false,
      reason: 'same-word',
    });
  });

  it('rejects a pure anagram of the current word', () => {
    expect(validateMove('cat', 'act', validWordsSet, index)).toEqual({
      valid: false,
      reason: 'same-word',
    });
  });

  it('rejects a word not in the dictionary', () => {
    expect(validateMove('cat', 'zzzz', validWordsSet, index)).toEqual({
      valid: false,
      reason: 'not-a-word',
    });
  });

  it('rejects a valid word that is not a legal one-move neighbor', () => {
    expect(validateMove('cat', 'care', validWordsSet, index)).toEqual({
      valid: false,
      reason: 'not-adjacent',
    });
  });

  it('accepts a legal add/remove/swap move', () => {
    expect(validateMove('cat', 'cats', validWordsSet, index)).toEqual({ valid: true });
    expect(validateMove('cat', 'at', validWordsSet, index)).toEqual({ valid: true });
    expect(validateMove('cat', 'cot', validWordsSet, index)).toEqual({ valid: true });
  });
});
