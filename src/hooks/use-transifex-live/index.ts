'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getTransifexLive,
  onTransifexLiveReady,
  type TransifexLanguage,
  type TransifexLive,
} from '@/lib/transifex-live';

type UseTransifexLive = {
  languages: TransifexLanguage[];
  /** Currently applied language, `null` until Live is ready. */
  currentLanguage: TransifexLanguage | null;
  translateTo: (code: string) => void;
};

/**
 * `getSelectedLanguageCode()` is an empty string until Live commits a language,
 * so fall back to the one it detected — hence `||`, not `??`.
 */
function readCode(live: TransifexLive): string {
  return live.getSelectedLanguageCode() || live.detectLanguage();
}

/**
 * Read/write access to Transifex Live's language state for the language
 * selectors. Initialisation is not done here — `TransifexLiveInit` in the root
 * layout owns that, so Live starts exactly once and only after hydration.
 */
export function useTransifexLive(): UseTransifexLive {
  const [languages, setLanguages] = useState<TransifexLanguage[]>([]);
  const [currentCode, setCurrentCode] = useState<string | null>(null);

  useEffect(() => {
    return onTransifexLiveReady((live) => {
      setLanguages(live.getAllLanguages() ?? []);
      setCurrentCode(readCode(live));
      // Keeps the desktop and mobile selectors in sync with each other, and with
      // a language Live picked itself via `detectlang`. The event payload doesn't
      // reliably carry the code, so re-read it from Live.
      live.onTranslatePage(() => setCurrentCode(readCode(live)));
    });
  }, []);

  const translateTo = useCallback((code: string) => {
    getTransifexLive()?.translateTo(code);
    setCurrentCode(code);
  }, []);

  return {
    languages,
    currentLanguage: languages.find((language) => language.code === currentCode) ?? null,
    translateTo,
  };
}
