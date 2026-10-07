// Cookie-consent persistence. A first-party cookie (not localStorage) so the
// choice is visible to any future server-side code paths and shares the same
// lifetime semantics as the cookies it governs.

export const COOKIE_CONSENT_NAME = 'gmw_cookie_consent';

export type CookieConsent = 'accepted' | 'rejected';

// 12 months: the longest lifetime most EU regulators accept for a consent
// record before the question has to be asked again.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function isCookieConsent(value: string | undefined): value is CookieConsent {
  return value === 'accepted' || value === 'rejected';
}

/**
 * Parse the consent cookie out of a cookie header / `document.cookie` string.
 * Returns `null` when the user has not decided yet or the value is unknown.
 */
export function parseCookieConsent(cookieString: string): CookieConsent | null {
  for (const part of cookieString.split(';')) {
    const [rawName, ...rest] = part.split('=');
    if (rawName?.trim() !== COOKIE_CONSENT_NAME) continue;
    const value = decodeURIComponent(rest.join('=').trim());
    return isCookieConsent(value) ? value : null;
  }
  return null;
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof document === 'undefined') return null;
  return parseCookieConsent(document.cookie);
}

export function writeCookieConsent(value: CookieConsent): void {
  if (typeof document === 'undefined') return;
  const secure =
    typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_CONSENT_NAME}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

export function hasAcceptedCookies(): boolean {
  return readCookieConsent() === 'accepted';
}
