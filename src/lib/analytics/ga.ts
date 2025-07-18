import ReactGA from 'react-ga4';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

type ReactGAEvent = {
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
};

// log the pageview with their URL
export const GAPage = (url: string): void => {
  if (window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// log specific events happening.
export const GAEvent = ({ action, params }): void => {
  if (window.gtag) {
    window.gtag('event', action, params);
  }
};

// Track events
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  ReactGA.event(eventName, params);
}
