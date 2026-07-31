import type { Transifex } from '@/lib/transifex-live';

declare global {
  interface Window {
    // ? As we are using explicitily window to access the `gtag` property we need to declare it before using it
    gtag: UniversalAnalytics.ga;
    /** Injected by the Transifex Live snippet in `src/app/layout.tsx`. Absent until `live.js` loads. */
    Transifex?: Transifex;
  }
}

declare module 'react' {
  // The type parameter is unused here but has to be declared to match React's own signature,
  // otherwise the interfaces don't merge.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    // `inert` is typed from React 19 on. We're on 18, so declare it here — it's how content that
    // stays mounted while hidden (collapsed widget bodies, the guide overlay's visual echo of a
    // control) is kept out of the tab order and the accessibility tree.
    inert?: '' | undefined;
  }
}

// ? If your module exports nothing, you will need this line. Otherwise, delete it */
export {};
