/* eslint-disable */
// Self-destructing service worker.
//
// This branch has no offline support, but browsers that once ran the `feat/offline-maps`
// build keep its service worker registered at /sw.js (scope "/") and go on serving that
// build's cached HTML and chunks on this origin. The browser re-checks the registered
// script URL on navigation; because this file differs byte-for-byte from the old one it
// installs, takes over, wipes every Cache Storage entry, unregisters itself and reloads
// open tabs so they get the live bundle. Browsers that never registered a worker never
// request this file.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      await Promise.all(clients.map((client) => client.navigate(client.url)));
    })()
  );
});
