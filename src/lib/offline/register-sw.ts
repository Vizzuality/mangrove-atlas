import { env } from '../../../env.mjs';

/**
 * Registers the offline-maps service worker (public/sw.js).
 *
 * Production-build only: gated on NODE_ENV (set to 'development' only by
 * `next dev`), so the SW never caches Next's HMR/_next assets during local
 * iteration but is active in every real build — preview, prod, and the
 * Playwright production server. The main API origin is passed via query string
 * so the worker (which cannot import env.mjs) knows which requests to cache.
 *
 * Safe to call repeatedly — the browser dedupes registration of the same URL.
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  if (process.env.NODE_ENV !== 'production') return;

  const originOf = (raw?: string) => {
    try {
      return raw ? new URL(raw).origin : '';
    } catch {
      return '';
    }
  };

  const qs = new URLSearchParams();
  const apiOrigin = originOf(env.NEXT_PUBLIC_API_URL);
  const baseOrigin = originOf(env.NEXT_PUBLIC_OFFLINE_BASEMAP_URL);
  const tilerOrigin = originOf(env.NEXT_PUBLIC_ALERTS_TILER_URL);
  if (apiOrigin) qs.set('api', apiOrigin);
  if (baseOrigin) qs.set('base', baseOrigin);
  if (tilerOrigin) qs.set('tiler', tilerOrigin);

  const swUrl = qs.toString() ? `/sw.js?${qs.toString()}` : '/sw.js';

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl, { scope: '/' }).catch(() => {
      // Offline caching is a progressive enhancement — ignore registration errors.
    });
  });
}
