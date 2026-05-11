import ReactGA from 'react-ga4';

// Track events
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  ReactGA.event(eventName, params);
}
