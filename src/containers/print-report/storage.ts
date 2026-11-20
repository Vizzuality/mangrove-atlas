/**
 * Hands the custom area over from the map tab to the print report tab.
 *
 * Drawing/upload state lives in in-memory Jotai atoms, so a tab opened with `window.open`
 * starts without the geometry. The opener writes it to localStorage under a random id that
 * travels in the print URL (`?report=<id>`); the print tab reads it back on load. Entries
 * are kept (so reloading the print tab still works) and pruned after a day.
 */

const KEY_PREFIX = 'gmw-print-report:';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const PRINT_REPORT_PARAM = 'report';

export type PrintReportArea = {
  geojson: GeoJSON.FeatureCollection;
  name: string | null;
  createdAt: number;
};

const pruneExpired = () => {
  const now = Date.now();
  for (let i = window.localStorage.length - 1; i >= 0; i--) {
    const key = window.localStorage.key(i);
    if (!key?.startsWith(KEY_PREFIX)) continue;
    try {
      const { createdAt } = JSON.parse(window.localStorage.getItem(key) ?? '{}') as {
        createdAt?: number;
      };
      if (!createdAt || now - createdAt > MAX_AGE_MS) window.localStorage.removeItem(key);
    } catch {
      window.localStorage.removeItem(key);
    }
  }
};

/** Returns the id to put in the print URL, or null when storage is unavailable. */
export const savePrintReportArea = (
  geojson: GeoJSON.FeatureCollection,
  name: string | null
): string | null => {
  try {
    pruneExpired();
    const id = crypto.randomUUID();
    const value: PrintReportArea = { geojson, name, createdAt: Date.now() };
    window.localStorage.setItem(`${KEY_PREFIX}${id}`, JSON.stringify(value));
    return id;
  } catch {
    return null;
  }
};

export const loadPrintReportArea = (id: string): PrintReportArea | null => {
  try {
    const raw = window.localStorage.getItem(`${KEY_PREFIX}${id}`);
    return raw ? (JSON.parse(raw) as PrintReportArea) : null;
  } catch {
    return null;
  }
};
