/* eslint-disable */
// Mangrove Atlas — offline-maps service worker.
//
// Two jobs:
//   1) Transparent runtime cache (faster revisits + accidental-offline resilience).
//   2) Backing store for deliberate "download this area / work offline" downloads.
//
// Hand-rolled on the native Cache Storage API — no Workbox / next-pwa (not on the
// Vizzuality Tech Radar). Mapbox tiles/styles are NEVER cached (TOS).

const params = (() => {
  try {
    return new URL(self.location).searchParams;
  } catch {
    return new URLSearchParams();
  }
})();

// Per-build stamp injected at registration (?v=<commit-sha|local-ts>). Volatile
// cache names are suffixed with it so a new build = new cache names = the
// activate step purges the previous build's HTML/chunks/tiles (no stale-build
// 500s). Falls back to 'v1' when unset (e.g. SW served without the query).
const VERSION = params.get('v') || 'v1';
const TILE_CACHE = `mangrove-tiles-${VERSION}`; // transparent, volatile
const DATA_CACHE = `mangrove-data-${VERSION}`; // transparent, volatile
const STATIC_CACHE = `mangrove-static-${VERSION}`; // app shell, volatile
const OFFLINE_CACHE = `mangrove-offline`; // deliberate downloads — PERSISTENT, never auto-purged
const VOLATILE_CACHES = [TILE_CACHE, DATA_CACHE, STATIC_CACHE];

const MAX_TILES = 1500;
const MAX_DATA = 300;
const TILE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const originOf = (raw) => {
  try {
    return raw ? new URL(raw).origin : null;
  } catch {
    return null;
  }
};
// Injected at registration: /sw.js?api=<origin>&base=<offline-basemap-origin>&tiler=<alerts-tiler-origin>.
const API_ORIGIN = originOf(params.get('api'));
const BASE_ORIGIN = originOf(params.get('base'));
const TILER_ORIGIN = originOf(params.get('tiler'));

const isGCSTile = (url) =>
  /(^|\.)storage\.googleapis\.com$/.test(url.hostname) &&
  /\/\d+\/\d+\/\d+(\.\w+)?$/.test(url.pathname); // .../{z}/{x}/{y}[.ext]

const isOfflineBaseTile = (url) => BASE_ORIGIN && url.origin === BASE_ORIGIN;

// Self-hosted alerts tiler (cloud function). Tiles are keyed by z/x/y + date in
// the query string, so cache by full URL (CacheFirst handles that).
const isTilerTile = (url) => TILER_ORIGIN && url.origin === TILER_ORIGIN;

const isApiData = (url) =>
  API_ORIGIN &&
  url.origin === API_ORIGIN &&
  !/\/auth(\/|$)|\/login|\/token|\/oauth/i.test(url.pathname);

const isStaticAsset = (url) =>
  url.origin === self.location.origin &&
  (url.pathname.startsWith('/_next/static/') ||
    /\.(?:js|css|woff2?|ttf|otf|svg|png|webp)$/.test(url.pathname));

// ---- cache helpers ---------------------------------------------------------

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  for (const key of keys.slice(0, keys.length - maxEntries)) await cache.delete(key);
}

function isExpired(response, maxAgeMs) {
  const dateHeader = response.headers.get('date');
  const cachedAt = dateHeader && !Number.isNaN(Date.parse(dateHeader)) ? Date.parse(dateHeader) : 0;
  return cachedAt > 0 && Date.now() - cachedAt > maxAgeMs;
}

// Serve from a deliberate download first, then fall through to a strategy.
async function offlineFirst(request) {
  const cache = await caches.open(OFFLINE_CACHE);
  return cache.match(request);
}

async function cacheFirst(request, cacheName, { maxEntries, maxAgeMs } = {}) {
  const downloaded = await offlineFirst(request);
  if (downloaded) return downloaded;

  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached && !(maxAgeMs && isExpired(cached, maxAgeMs))) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      await cache.put(request, response.clone());
      if (maxEntries) trimCache(cacheName, maxEntries);
    }
    return response;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

async function staleWhileRevalidate(request, cacheName, { maxEntries } = {}) {
  const downloaded = await offlineFirst(request);
  const cache = await caches.open(cacheName);
  const cached = downloaded || (await cache.match(request));
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone()).then(() => {
          if (maxEntries) trimCache(cacheName, maxEntries);
        });
      }
      return response;
    })
    .catch(() => null);
  return cached || network || fetch(request);
}

// Document/navigation: network first, fall back to any cached copy so the app
// boots with no connection (app shell).
async function networkFirstDoc(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = (await offlineFirst(request)) || (await cache.match(request));
    if (cached) return cached;
    // Last resort: the app root, so the SPA can render an offline state.
    const root = (await offlineFirst('/')) || (await cache.match('/'));
    if (root) return root;
    throw err;
  }
}

// ---- deliberate download (message channel) ---------------------------------

async function cacheUrls(urls, onProgress) {
  const cache = await caches.open(OFFLINE_CACHE);
  let done = 0;
  let failed = 0;
  const CONCURRENCY = 6;
  const queue = [...urls];

  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (res && (res.ok || res.type === 'opaque')) await cache.put(url, res.clone());
        else failed++;
      } catch {
        failed++;
      }
      done++;
      if (done % 10 === 0 || queue.length === 0) onProgress(done, failed);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return { done, failed };
}

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'CACHE_URLS') {
    const { urls = [], regionId, total } = data;
    const client = event.source;
    event.waitUntil(
      cacheUrls(urls, (done, failed) => {
        client &&
          client.postMessage({ type: 'CACHE_PROGRESS', regionId, done, failed, total: total ?? urls.length });
      }).then((r) => {
        client && client.postMessage({ type: 'CACHE_DONE', regionId, ...r });
      })
    );
  } else if (data.type === 'PERSIST_DATA_CACHE') {
    // Copy whatever widget JSON is already in the volatile data cache into the
    // persistent offline cache, so the sidebar works offline for this location.
    const client = event.source;
    event.waitUntil(
      (async () => {
        const [src, dst] = await Promise.all([
          caches.open(DATA_CACHE),
          caches.open(OFFLINE_CACHE),
        ]);
        const keys = await src.keys();
        await Promise.all(
          keys.map(async (req) => {
            const res = await src.match(req);
            if (res) await dst.put(req, res.clone());
          })
        );
        client && client.postMessage({ type: 'DATA_PERSISTED', count: keys.length });
      })()
    );
  } else if (data.type === 'DELETE_REGION_URLS') {
    const { urls = [] } = data;
    event.waitUntil(
      caches.open(OFFLINE_CACHE).then((cache) => Promise.all(urls.map((u) => cache.delete(u))))
    );
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ---- lifecycle -------------------------------------------------------------

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      // Purge stale volatile caches only. OFFLINE_CACHE (deliberate downloads) survives.
      await Promise.all(
        names
          .filter((n) => n.startsWith('mangrove-') && n !== OFFLINE_CACHE && !VOLATILE_CACHES.includes(n))
          .map((n) => caches.delete(n))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // analysis POST etc. → passthrough

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstDoc(request));
    return;
  }
  if (isGCSTile(url) || isOfflineBaseTile(url) || isTilerTile(url)) {
    event.respondWith(
      cacheFirst(request, TILE_CACHE, { maxEntries: MAX_TILES, maxAgeMs: TILE_MAX_AGE_MS })
    );
    return;
  }
  if (isApiData(url)) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE, { maxEntries: MAX_DATA }));
    return;
  }
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }
  // Mapbox / Planet / everything-else: passthrough (no caching).
});
