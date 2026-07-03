// Persistent-storage + quota helpers for deliberate offline downloads.
//
// Browsers evict *best-effort* storage automatically — Safari/iOS drops Cache
// Storage + IndexedDB after ~7 idle days, and every engine evicts under disk
// pressure. That would silently delete a downloaded region between the moment a
// user saves it and the moment they need it offline. Requesting *persistent*
// storage opts the origin out of automatic eviction where the browser honours it
// (Chrome grants via engagement / installed-PWA heuristics; Safari via an
// add-to-home-screen / prompt). All helpers degrade to a safe null/zero when the
// Storage API is missing, so callers never need to feature-detect.

export type StorageStatus = {
  /** true = persistent (won't be auto-evicted); false = best-effort; null = unknown/unsupported. */
  persisted: boolean | null;
  usage: number; // bytes currently used by this origin
  quota: number; // bytes the origin may use
};

export async function isStoragePersisted(): Promise<boolean | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persisted) return null;
  try {
    return await navigator.storage.persisted();
  } catch {
    return null;
  }
}

/**
 * Ask the browser to mark this origin's storage persistent. No-op returning the
 * current state if already persisted. Returns null when unsupported.
 */
export async function requestPersistentStorage(): Promise<boolean | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return null;
  try {
    if (navigator.storage.persisted && (await navigator.storage.persisted())) return true;
    return await navigator.storage.persist();
  } catch {
    return null;
  }
}

export async function getStorageEstimate(): Promise<{ usage: number; quota: number }> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) {
    return { usage: 0, quota: 0 };
  }
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    return { usage, quota };
  } catch {
    return { usage: 0, quota: 0 };
  }
}

export async function getStorageStatus(): Promise<StorageStatus> {
  const [persisted, estimate] = await Promise.all([isStoragePersisted(), getStorageEstimate()]);
  return { persisted, ...estimate };
}

/** Human-readable bytes (e.g. 45.2 MB). Falls back to "—" for zero/unknown. */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
