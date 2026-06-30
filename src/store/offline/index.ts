import { useEffect } from 'react';

import type { OfflineRegion } from '@/lib/offline/regions';

import { atom, useSetAtom } from 'jotai';

// Tracks browser connectivity. SSR-safe default (true); corrected on mount by
// useSyncOnlineStatus via the window online/offline events.
export const isOnlineAtom = atom(true);

// User-driven "work offline" toggle — forces the offline basemap + cached-only
// behaviour even when a (flaky) connection is technically present.
export const offlineModeAtom = atom(false);

// True when the map should behave offline: either the network dropped or the
// user opted into offline mode.
export const isOfflineAtom = atom((get) => !get(isOnlineAtom) || get(offlineModeAtom));

export type DownloadProgress = {
  regionId: string | null;
  status: 'idle' | 'running' | 'done' | 'error';
  done: number;
  total: number;
  failed: number;
};

export const downloadProgressAtom = atom<DownloadProgress>({
  regionId: null,
  status: 'idle',
  done: 0,
  total: 0,
  failed: 0,
});

// Downloaded regions, hydrated from IndexedDB (see useHydrateRegions).
export const regionsAtom = atom<OfflineRegion[]>([]);

/**
 * Binds isOnlineAtom to the browser's connectivity events. Mount once near the
 * app root (it returns nothing and renders nothing).
 */
export function useSyncOnlineStatus() {
  const setIsOnline = useSetAtom(isOnlineAtom);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, [setIsOnline]);
}
