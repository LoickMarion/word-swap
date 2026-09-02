import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { WordData } from './useWordData';
import { generatePuzzle, type Puzzle } from '../lib/puzzleGenerator';
import { validateMove, type MoveInvalidReason } from '../lib/moveValidation';
import { mulberry32, hashStringToSeed } from '../lib/rng';

export type GameMode = 'daily' | 'random';
export type GameStatus = 'playing' | 'won';

interface GameState {
  puzzle: Puzzle;
  path: string[];
  status: GameStatus;
  error: MoveInvalidReason | null;
}

type GameAction =
  | { type: 'NEW_GAME'; puzzle: Puzzle }
  | { type: 'RESET' }
  | { type: 'UNDO' }
  | { type: 'SUBMIT_WORD'; word: string; wordData: WordData }
  | { type: 'CLEAR_ERROR' };

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME':
      return {
        puzzle: action.puzzle,
        path: [action.puzzle.start],
        status: 'playing',
        error: null,
      };

    case 'SUBMIT_WORD': {
      if (state.status !== 'playing') return state;

      const current = state.path[state.path.length - 1];
      const next = action.word.trim().toLowerCase();
      const result = validateMove(current, next, action.wordData.validWordsSet, action.wordData.index);

      if (!result.valid) {
        return { ...state, error: result.reason };
      }

      const path = [...state.path, next];
      const status: GameStatus = next === state.puzzle.goal ? 'won' : 'playing';
      return { ...state, path, status, error: null };
    }

    case 'RESET':
      return { ...state, path: [state.puzzle.start], status: 'playing', error: null };

    case 'UNDO': {
      if (state.status !== 'playing' || state.path.length <= 1) return state;
      return { ...state, path: state.path.slice(0, -1), error: null };
    }

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// The daily puzzle for a given date is deterministic: the date string is
// hashed into a seed that drives the same seeded RNG every time, so everyone
// playing that date's puzzle gets the same start/goal pair.
function generatePuzzleForMode(wordData: WordData, mode: GameMode, dailyDate: string): Puzzle {
  const rng = mode === 'daily' ? mulberry32(hashStringToSeed(dailyDate)) : Math.random;
  return generatePuzzle(wordData.commonWords, wordData.index, rng);
}

function createInitialState(wordData: WordData, mode: GameMode, dailyDate: string): GameState {
  const puzzle = generatePuzzleForMode(wordData, mode, dailyDate);
  return { puzzle, path: [puzzle.start], status: 'playing', error: null };
}

export function useGame(wordData: WordData, mode: GameMode, dailyDate: string) {
  const [state, dispatch] = useReducer(reducer, null, () => createInitialState(wordData, mode, dailyDate));

  const modeKeyRef = useRef(`${mode}:${dailyDate}`);
  useEffect(() => {
    const key = `${mode}:${dailyDate}`;
    if (key === modeKeyRef.current) return;
    modeKeyRef.current = key;
    dispatch({ type: 'NEW_GAME', puzzle: generatePuzzleForMode(wordData, mode, dailyDate) });
  }, [wordData, mode, dailyDate]);

  const newGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME', puzzle: generatePuzzle(wordData.commonWords, wordData.index, Math.random) });
  }, [wordData]);

  const submitWord = useCallback(
    (word: string) => {
      dispatch({ type: 'SUBMIT_WORD', word, wordData });
    },
    [wordData],
  );

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);

  return { state, newGame, submitWord, clearError, reset, undo };
}
