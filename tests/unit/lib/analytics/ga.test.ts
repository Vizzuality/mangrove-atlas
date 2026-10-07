import ReactGA from 'react-ga4';

import { COOKIE_CONSENT_NAME } from '@/lib/analytics/consent';
import { trackEvent } from '@/lib/analytics/ga';

vi.mock('react-ga4', () => ({ default: { event: vi.fn() } }));

afterEach(() => {
  document.cookie = `${COOKIE_CONSENT_NAME}=; Max-Age=0; Path=/`;
  vi.clearAllMocks();
});

describe('trackEvent', () => {
  it('does nothing until cookies are accepted', () => {
    trackEvent('click', { a: 1 });
    expect(ReactGA.event).not.toHaveBeenCalled();

    document.cookie = `${COOKIE_CONSENT_NAME}=rejected; Path=/`;
    trackEvent('click', { a: 1 });
    expect(ReactGA.event).not.toHaveBeenCalled();
  });

  it('forwards to ReactGA once accepted', () => {
    document.cookie = `${COOKIE_CONSENT_NAME}=accepted; Path=/`;
    trackEvent('click', { a: 1 });
    expect(ReactGA.event).toHaveBeenCalledWith('click', { a: 1 });
  });
});
