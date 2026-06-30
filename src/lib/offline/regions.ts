// Metadata index for deliberately-downloaded offline regions. Tile/JSON bytes
// live in the SW's `mangrove-offline` Cache; this IndexedDB store just records
// what was downloaded so the UI can list, restore camera to, and delete regions.
//
// Hand-rolled (no `idb`/`Dexie` — not on the Tech Radar). Promise-wrapped.

import type { BBox } from './tiles';

export type OfflineRegion = {
  id: string;
  name: string;
  bbox: BBox;
  minZoom: number;
  maxZoom: number;
  layerIds: string[];
  tileCount: number;
  /** Every URL cached for this region — used to evict on delete. */
  urls: string[];
  createdAt: number;
};

const DB_NAME = 'mangrove-offline';
const STORE = 'regions';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE, mode);
        const request = run(transaction.objectStore(STORE));
        transaction.oncomplete = () => {
          resolve(request.result);
          db.close();
        };
        transaction.onerror = () => {
          reject(transaction.error);
          db.close();
        };
      })
  );
}

export function putRegion(region: OfflineRegion): Promise<IDBValidKey> {
  return tx('readwrite', (store) => store.put(region));
}

export function listRegions(): Promise<OfflineRegion[]> {
  return tx<OfflineRegion[]>('readonly', (store) => store.getAll()).then((rows) =>
    [...rows].sort((a, b) => b.createdAt - a.createdAt)
  );
}

export function getRegion(id: string): Promise<OfflineRegion | undefined> {
  return tx('readonly', (store) => store.get(id));
}

export function deleteRegion(id: string): Promise<undefined> {
  return tx('readwrite', (store) => store.delete(id));
}
