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

// Track events with a predefined category
export function trackEvent(categoryName: string, options: ReactGAEvent): void {
  console.log(categoryName, 'fuera *********************');

  console.log(categoryName, 'dentro *********************');
  ReactGA.event({
    action: 'custom_test_event',
  });
  ReactGA.event({ category: categoryName, ...options });
}
