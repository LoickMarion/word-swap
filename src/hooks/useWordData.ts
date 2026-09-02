import { useEffect, useRef, useState } from 'react';
import { buildWordIndex, type WordIndex } from '../lib/wordIndex';

export interface WordData {
  index: WordIndex;
  validWordsSet: Set<string>;
  commonWords: string[];
}

export type WordDataState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: WordData };

export function useWordData(): WordDataState {
  const [state, setState] = useState<WordDataState>({ status: 'loading' });
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    Promise.all([import('../data/validWords.json'), import('../data/commonWords.json')])
      .then(([validWordsModule, commonWordsModule]) => {
        const validWords = validWordsModule.default as string[];
        const commonWords = commonWordsModule.default as string[];
        const index = buildWordIndex(validWords);
        const validWordsSet = new Set(validWords);
        setState({ status: 'ready', data: { index, validWordsSet, commonWords } });
      })
      .catch((err: unknown) => {
        setState({
          status: 'error',
          error: err instanceof Error ? err.message : 'Failed to load word data.',
        });
      });
  }, []);

  return state;
}
