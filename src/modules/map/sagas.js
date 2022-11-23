import { takeLatest, put, select } from "redux-saga/effects";
import { currentLocation } from "modules/locations/selectors";
import bboxTurf from "@turf/bbox";
import {
  resetViewport,
  setBounds,
  setBasemap,
  setViewport,
  setViewportFixed,
} from "./actions";
import countriesDictionary from "./constants";

function* flyToCurrentLocation() {
  const state = yield select();
  const location = currentLocation(state);

  const { mapView } = state.app.mobile;

  if (location) {
    if (location.location_type === "worldwide") {
      if (!state.map.isViewportFixed) {
        yield put(resetViewport());
      }
    } else {

      const locationException = countriesDictionary[location.iso];

      const bbox = locationException
        ? locationException.bounds
        : location.bounds;

      if (!state.map.isViewportFixed) {
        yield put(
          setBounds({
            bbox: bboxTurf(bbox),
            options: {
              padding: {
                top: 50,
                bottom: 50,
                right: 20,
                left: mapView ? 20 : 620,
              },
            },
          })
        );
      }
    }
    yield put(setViewportFixed({ value: false }));
  }
}

// Part of query state, not normal flow.
// View ./index.js queryState.add for more info.
export function* restoreMapState() {
  /**
   * A regular selector, it could be on a selectors file with reselect
   * or better yet, be created automatically by the package based on registered namespace info.
   */
  const basemapSelector = (state) =>
    (state.router.query &&
      state.router.query.map &&
      state.router.query.map.basemap) ||
    null;

  const viewportSelector = (state) =>
    (state.router.query &&
      state.router.query.map &&
      state.router.query.map.viewport) ||
    null;
  const basemap = yield select(basemapSelector);
  const viewport = yield select(viewportSelector);

  if (basemap) {
    yield put(setBasemap(basemap));
  }

  if (viewport) {
    yield put(setViewportFixed({ value: true }));
    yield put(setViewport(viewport));
  }
}

export default function* pages() {
  yield takeLatest("LOCATIONS/FETCH_SUCCEDED", flyToCurrentLocation);
  yield takeLatest("LOCATIONS/SET_CURRENT", flyToCurrentLocation);
  yield takeLatest("APP/MOBILE", flyToCurrentLocation);
}
