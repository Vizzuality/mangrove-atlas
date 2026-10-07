import { useCallback, useEffect } from 'react';

import { readCookieConsent, writeCookieConsent } from '@/lib/analytics/consent';
import type { CookieConsent } from '@/lib/analytics/consent';

import { atom, useAtom } from 'jotai';

// `'unknown'` = not read from the cookie yet (SSR and first client render),
// `null` = read, user has not decided. Keeping the two apart lets the banner
// stay unmounted until hydration instead of flashing on every page load for
// users who already chose.
export type CookieConsentState = CookieConsent | null | 'unknown';

export const cookieConsentAtom = atom<CookieConsentState>('unknown');

export function useCookieConsent() {
  const [consent, setConsentAtom] = useAtom(cookieConsentAtom);

  useEffect(() => {
    if (consent === 'unknown') setConsentAtom(readCookieConsent());
  }, [consent, setConsentAtom]);

  const setConsent = useCallback(
    (value: CookieConsent) => {
      writeCookieConsent(value);
      setConsentAtom(value);
    },
    [setConsentAtom]
  );

  return { consent, setConsent };
}
