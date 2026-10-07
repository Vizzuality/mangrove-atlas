import {
  COOKIE_CONSENT_NAME,
  hasAcceptedCookies,
  parseCookieConsent,
  readCookieConsent,
  writeCookieConsent,
} from '@/lib/analytics/consent';

function clearConsentCookie() {
  document.cookie = `${COOKIE_CONSENT_NAME}=; Max-Age=0; Path=/`;
}

describe('parseCookieConsent', () => {
  it('returns null when the cookie is absent', () => {
    expect(parseCookieConsent('')).toBeNull();
    expect(parseCookieConsent('foo=bar; baz=qux')).toBeNull();
  });

  it('reads accepted / rejected regardless of position', () => {
    expect(parseCookieConsent(`${COOKIE_CONSENT_NAME}=accepted`)).toBe('accepted');
    expect(parseCookieConsent(`a=1; ${COOKIE_CONSENT_NAME}=rejected; b=2`)).toBe('rejected');
  });

  it('treats unknown values as undecided', () => {
    expect(parseCookieConsent(`${COOKIE_CONSENT_NAME}=maybe`)).toBeNull();
  });
});

describe('read/write cookie consent', () => {
  beforeEach(clearConsentCookie);
  afterEach(clearConsentCookie);

  it('round-trips through document.cookie', () => {
    expect(readCookieConsent()).toBeNull();
    expect(hasAcceptedCookies()).toBe(false);

    writeCookieConsent('accepted');
    expect(readCookieConsent()).toBe('accepted');
    expect(hasAcceptedCookies()).toBe(true);

    writeCookieConsent('rejected');
    expect(readCookieConsent()).toBe('rejected');
    expect(hasAcceptedCookies()).toBe(false);
  });
});
