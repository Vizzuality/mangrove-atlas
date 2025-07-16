import ReactGA from 'react-ga4';

<<<<<<< HEAD
=======

>>>>>>> 4ed7dc28 (ga events)
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

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

<<<<<<< HEAD
// Track events
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  ReactGA.event(eventName, params);
}
=======
// Track events with a predefined category
export function trackEvent(categoryName: string) {
  return (options: ReactGAEvent) => {
    ReactGA.event({ category: categoryName, ...options });
  };
}
>>>>>>> 4ed7dc28 (ga events)
