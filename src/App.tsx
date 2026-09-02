import { useState } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { useWordData, type WordData } from './hooks/useWordData';
import { useGame, type GameMode } from './hooks/useGame';
import { GameHeader } from './components/GameHeader';
import { WordInput } from './components/WordInput';
import { PathTrail } from './components/PathTrail';
import { ResultSummary } from './components/ResultSummary';
import { NewGameButton } from './components/NewGameButton';
import { ResetButton } from './components/ResetButton';
import { RevealSolutionButton } from './components/RevealSolutionButton';
import { SolutionReveal } from './components/SolutionReveal';
import { HintButton } from './components/HintButton';
import { HintReveal } from './components/HintReveal';
import { ModeToggle } from './components/ModeToggle';
import { DailyDatePicker } from './components/DailyDatePicker';
import { DAILY_MIN_DATE, getTodayDateString, validateDailyDate } from './lib/dailyDate';
import { getHintWords } from './lib/hint';

const DATE_ERROR_MESSAGES = {
  future: "You can't select a future date.",
  'too-early': 'Daily puzzles start January 1, 2026.',
};

function Game({ wordData }: { wordData: WordData }) {
  const today = getTodayDateString();
  const [mode, setMode] = useState<GameMode>('daily');
  const [dailyDate, setDailyDate] = useState(today);
  const [dateError, setDateError] = useState<string | null>(null);

  const { state, newGame, submitWord, clearError, reset } = useGame(wordData, mode, dailyDate);
  const currentWord = state.path[state.path.length - 1];

  const [showSolution, setShowSolution] = useState(false);
  const [lastPuzzle, setLastPuzzle] = useState(state.puzzle);
  if (state.puzzle !== lastPuzzle) {
    setLastPuzzle(state.puzzle);
    setShowSolution(false);
  }

  const [showHint, setShowHint] = useState(false);
  const [lastCurrentWord, setLastCurrentWord] = useState(currentWord);
  if (currentWord !== lastCurrentWord) {
    setLastCurrentWord(currentWord);
    setShowHint(false);
  }

  function handleModeChange(nextMode: GameMode) {
    setDateError(null);
    if (nextMode === 'daily') setDailyDate(today);
    setMode(nextMode);
  }

  function handleDateChange(nextDate: string) {
    const result = validateDailyDate(nextDate, today);
    if (!result.valid) {
      setDateError(DATE_ERROR_MESSAGES[result.reason]);
      return;
    }
    setDateError(null);
    setDailyDate(nextDate);
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <ModeToggle mode={mode} onChange={handleModeChange} />
        {mode === 'daily' && (
          <DailyDatePicker
            date={dailyDate}
            min={DAILY_MIN_DATE}
            max={today}
            error={dateError}
            onChange={handleDateChange}
          />
        )}
      </div>

      <GameHeader start={state.puzzle.start} goal={state.puzzle.goal} currentWord={currentWord} />

      {state.status === 'playing' ? (
        <WordInput disabled={false} error={state.error} onSubmit={submitWord} onClearError={clearError} />
      ) : (
        <ResultSummary playerLength={state.path.length - 1} shortestLength={state.puzzle.shortestLength} />
      )}

      <PathTrail path={state.path} />

      <div className="flex flex-wrap items-center justify-center gap-2">
        <ResetButton onClick={reset} disabled={state.path.length <= 1} />
        {state.status === 'playing' && (
          <HintButton revealed={showHint} onClick={() => setShowHint((v) => !v)} />
        )}
        <RevealSolutionButton revealed={showSolution} onClick={() => setShowSolution((v) => !v)} />
        {mode === 'random' && <NewGameButton onClick={newGame} />}
      </div>

      {showHint && (
        <HintReveal words={getHintWords(currentWord, state.puzzle.goal, wordData.index, 3)} />
      )}
      {showSolution && <SolutionReveal path={state.puzzle.shortestPathWords} />}
    </div>
  );
}

function AppContent() {
  const wordData = useWordData();

  return (
    <div className="flex h-dvh flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800">
        <a
          href="https://www.loickmarion.com/games"
          className="justify-self-start text-neutral-500 hover:underline dark:text-neutral-400"
        >
          ← All games
        </a>
        <span className="justify-self-center font-semibold tracking-tight">Wordmorph</span>
        <div className="justify-self-end">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-4 py-8">
        <p className="max-w-md text-center text-sm text-neutral-500 dark:text-neutral-400">
          Add, remove, or swap a letter each move (letters can switch order) to turn the start word into the
          goal word.
        </p>

        {wordData.status === 'loading' && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading word list…</p>
        )}
        {wordData.status === 'error' && (
          <p className="text-sm text-red-500 dark:text-red-400">Couldn't load word data: {wordData.error}</p>
        )}
        {wordData.status === 'ready' && <Game wordData={wordData.data} />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
