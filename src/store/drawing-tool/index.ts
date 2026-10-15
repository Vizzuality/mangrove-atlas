import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export const drawingToolAtom = atomWithReset<{
  enabled: boolean;
  customGeojson: GeoJSON.FeatureCollection | null;
  uploadedGeojson: GeoJSON.FeatureCollection | null;
}>({
  // ? this property allows to enable/disable the drawing mode in the map
  enabled: false,
  // ? this property stores a geojson geometry draw by the user
  customGeojson: null,
  // ? this property stores a geojson geometry uploaded by the user
  uploadedGeojson: null,
});

export const drawingUploadToolAtom = atomWithReset<{
  enabled: boolean;
  customGeojson: GeoJSON.FeatureCollection | null;
  uploadedGeojson: GeoJSON.FeatureCollection | null;
}>({
  // ? this property allows to enable/disable the drawing mode in the map
  enabled: false,
  // ? this property stores a geojson geometry drawn by the user
  customGeojson: null,
  // ? this property stores a geojson geometry uploaded by the user
  uploadedGeojson: null,
});

/**
 * Display name for a custom area that came from a named source (today: MRTT sites).
 * Paired with the exact FeatureCollection it names so the label is only shown while that
 * geometry is still the active upload — a new draw/upload/delete makes it stale on its own.
 */
export const customAreaNameAtom = atomWithReset<{
  name: string;
  geojson: GeoJSON.FeatureCollection;
} | null>(null);

export const customAreaLabelAtom = atom<string | null>((get) => {
  const named = get(customAreaNameAtom);
  const { uploadedGeojson } = get(drawingUploadToolAtom);
  return named && uploadedGeojson && named.geojson === uploadedGeojson ? named.name : null;
});
