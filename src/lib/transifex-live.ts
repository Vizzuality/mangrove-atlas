/**
 * Typed access to the Transifex Live vendor global (`window.Transifex.live`),
 * injected by the `cdn.transifex.com/live.js` snippet in `src/app/layout.tsx`.
 *
 * Live translates by mutating the DOM, outside React's knowledge. The snippet is
 * therefore configured with `manual_init: true` and initialised from here, once,
 * *after* React has hydrated — otherwise the vendor script rewrites the server
 * HTML while React is still hydrating it and every translated text node becomes a
 * hydration mismatch (React #418 / "server rendered text didn't match the client").
 *
 * @see https://help.transifex.com/en/articles/6370718-javascript-api
 */

export type TransifexLanguage = { code: string; name: string };

export interface TransifexLive {
  init: () => void;
  detectLanguage: () => string;
  getAllLanguages: () => TransifexLanguage[] | undefined;
  getSelectedLanguageCode: () => string;
  translateTo: (code: string) => void;
  /** Fires after Live applies a language. Its payload is unreliable — re-read the getters. */
  onTranslatePage: (callback: () => void) => void;
}

export interface Transifex {
  live: TransifexLive;
}

/** `live.js` is loaded `async`, so the global may not exist yet. */
export function getTransifexLive(): TransifexLive | null {
  if (typeof window === 'undefined') return null;
  return window.Transifex?.live ?? null;
}

const POLL_INTERVAL_MS = 50;
const POLL_TIMEOUT_MS = 15_000;

/**
 * Run `attempt` now and, while it reports "not yet", keep retrying until it
 * succeeds or we give up (`live.js` blocked by an extension, offline, …).
 *
 * Polling rather than a load/ready callback because the script is `async`: the
 * global can appear before or after any given component mounts, and Live exposes
 * no way to observe "loaded" from outside itself.
 *
 * Returns a cancel function for the pending poll.
 */
function pollUntil(attempt: () => boolean): () => void {
  if (typeof window === 'undefined' || attempt()) return () => undefined;

  let elapsed = 0;
  const intervalId = window.setInterval(() => {
    elapsed += POLL_INTERVAL_MS;
    if (attempt() || elapsed >= POLL_TIMEOUT_MS) {
      window.clearInterval(intervalId);
    }
  }, POLL_INTERVAL_MS);

  return () => window.clearInterval(intervalId);
}

let initialized = false;

/**
 * Initialise Transifex Live once per page load. Safe to call from several
 * components — the first caller wins, the rest are no-ops.
 */
export function initTransifexLive(): () => void {
  return pollUntil(() => {
    const live = getTransifexLive();
    if (!live) return false;
    if (!initialized) {
      initialized = true;
      live.init();
    }
    return true;
  });
}

/**
 * Run `callback` once Live has loaded and knows its languages — i.e. once its
 * getters are usable. Works whether the caller mounts before or after Live is
 * ready, so late-mounting consumers (mobile nav, modals) aren't left blank.
 */
export function onTransifexLiveReady(callback: (live: TransifexLive) => void): () => void {
  return pollUntil(() => {
    const live = getTransifexLive();
    if (!live?.getAllLanguages()?.length) return false;
    callback(live);
    return true;
  });
}
