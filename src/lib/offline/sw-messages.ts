// Thin wrapper over the service-worker message channel used by the download
// orchestrator. No-ops gracefully when there is no controlling SW (dev, no
// support), so callers don't need to guard.

type SWMessage =
  | { type: 'CACHE_URLS'; urls: string[]; regionId: string; total: number }
  | { type: 'PERSIST_DATA_CACHE' }
  | { type: 'DELETE_REGION_URLS'; urls: string[] }
  | { type: 'SKIP_WAITING' };

export function isSWAvailable(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator &&
    navigator.serviceWorker.controller != null
  );
}

export function sendToSW(message: SWMessage): void {
  if (!isSWAvailable()) return;
  navigator.serviceWorker.controller?.postMessage(message);
}

/** Subscribe to SW → page messages. Returns an unsubscribe fn. */
export function onSWMessage(handler: (data: unknown) => void): () => void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return () => {};
  const listener = (event: MessageEvent) => handler(event.data);
  navigator.serviceWorker.addEventListener('message', listener);
  return () => navigator.serviceWorker.removeEventListener('message', listener);
}
