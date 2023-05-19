import type { ViewState } from 'react-map-gl';

export const DEFAULT_VIEW_STATE: Partial<ViewState> = {
  zoom: 2,
  latitude: 0,
  longitude: 0,
};

export const WORLD_BOUNDS = [
  -138.95507812500276, -52.891795671778574, 138.95507812499835, 71.30988275111358,
];
