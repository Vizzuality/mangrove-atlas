import ReactGA from 'react-ga4';

import { hasAcceptedCookies } from './consent';

// Track events. No-op until the visitor accepts non-essential cookies; the
// gtag.js loader is gated on the same cookie (see components/analytics).
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (!hasAcceptedCookies()) return;
  ReactGA.event(eventName, params);
}
