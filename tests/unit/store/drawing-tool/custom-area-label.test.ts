import {
  customAreaLabelAtom,
  customAreaNameAtom,
  drawingUploadToolAtom,
} from '@/store/drawing-tool';

import { createStore } from 'jotai';
import { RESET } from 'jotai/utils';

const fc = (): GeoJSON.FeatureCollection => ({ type: 'FeatureCollection', features: [] });

describe('customAreaLabelAtom', () => {
  it('is null when nothing is named', () => {
    const store = createStore();
    expect(store.get(customAreaLabelAtom)).toBeNull();
  });

  it('shows the name while the named geometry is the active upload', () => {
    const store = createStore();
    const geojson = fc();
    store.set(customAreaNameAtom, { name: 'Site A', geojson });
    store.set(drawingUploadToolAtom, (prev) => ({ ...prev, uploadedGeojson: geojson }));
    expect(store.get(customAreaLabelAtom)).toBe('Site A');
  });

  it('goes stale when a different geometry is uploaded or the upload is reset', () => {
    const store = createStore();
    const geojson = fc();
    store.set(customAreaNameAtom, { name: 'Site A', geojson });
    store.set(drawingUploadToolAtom, (prev) => ({ ...prev, uploadedGeojson: geojson }));

    store.set(drawingUploadToolAtom, (prev) => ({ ...prev, uploadedGeojson: fc() }));
    expect(store.get(customAreaLabelAtom)).toBeNull();

    store.set(drawingUploadToolAtom, (prev) => ({ ...prev, uploadedGeojson: geojson }));
    expect(store.get(customAreaLabelAtom)).toBe('Site A');

    store.set(drawingUploadToolAtom, RESET);
    expect(store.get(customAreaLabelAtom)).toBeNull();
  });
});
