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
