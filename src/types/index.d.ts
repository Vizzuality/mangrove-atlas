declare global {
  interface Window {
    // ? As we are using explicitily window to access the `gtag` property we need to declare it before using it
    gtag: UniversalAnalytics.ga;
    Transifex: Transifex;
  }
}

// ? If your module exports nothing, you will need this line. Otherwise, delete it */
export {};
