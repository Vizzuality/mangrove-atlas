import {
  takeLatest, put, select, delay,
} from 'redux-saga/effects';
import { currentLocation } from 'modules/locations/selectors';
import bboxTurf from '@turf/bbox';

import {
  TRANSITION_EVENTS,
} from 'react-map-gl';

import { fitBounds } from 'viewport-mercator-project';
import { setPrintMode } from 'modules/app/actions';
import {
  resetViewport,
  setBounds,
  setBasemap,
  setViewport,
  setViewportFixed,
} from './actions';

function* flyToCurrentLocation() {
  const state = yield select();
  const location = currentLocation(state);
  const { initial } = state.app;

  const { mobile: { mapView } } = state.app;
  const zoom = state?.router?.query?.zoom;
  if (location) {
    if (location.location_type === 'worldwide') {
      if (!state.map.isViewportFixed && initial) {
        yield put(resetViewport({ zoom }));
      } else if (!state.map.isViewportFixed && !initial && !zoom) {
        yield put(resetViewport());
      }
    } else {
      const bbox = location.bounds;

      if (!state.map.isViewportFixed) {
        yield put(
          setBounds({
            bbox: location.id === 'custom-area' ? bbox : bboxTurf(bbox),
            options: {
              padding: {
                top: 50,
                bottom: 50,
                right: 20,
                left: mapView ? 20 : 620,
              },
            },
          }),
        );
      }
    }
    yield put(setViewportFixed({ value: false }));
  }
}

function* setPrintingProcess({ payload: isPrinting }) {
  const {
    map: {
      bounds: { bbox },
      viewport,
    },
  } = yield select();

  const getLeftOffset = () => {
    if (isPrinting) {
      // todo: this magic formula does not work.
      return window.innerWidth > 795 ? -(window.innerWidth + 400) : 0;
    }

    // ? size of the sidebar
    return 620;
  };

  if (bbox) {
    const { longitude, latitude, zoom } = fitBounds({
      bounds: [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      width: window.innerWidth,
      height: window.innerHeight,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: getLeftOffset(),
      },
    });

    const newViewport = {
      ...viewport,
      longitude,
      latitude,
      zoom,
      transitionDuration: 0,
      transitionInterruption: TRANSITION_EVENTS.UPDATE,
    };

    yield put(setViewport(newViewport));
    yield delay(500);
  }

  yield put(setPrintMode(isPrinting));
}

// Part of query state, not normal flow.
// View ./index.js queryState.add for more info.
export function* restoreMapState() {
  /**
   * A regular selector, it could be on a selectors file with reselect
   * or better yet, be created automatically by the package based on registered namespace info.
   */
  const basemapSelector = (state) => (state.router.query
      && state.router.query.map
      && state.router.query.map.basemap)
    || null;

  const viewportSelector = (state) => (state.router.query
      && state.router.query.map
      && state.router.query.map.viewport)
    || null;
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
  yield takeLatest('LOCATIONS/FETCH_SUCCEDED', flyToCurrentLocation);
  yield takeLatest('LOCATIONS/SET_CURRENT', flyToCurrentLocation);
  yield takeLatest('DRAWING_TOOL/SET_DRAWING_VALUE', flyToCurrentLocation);
  yield takeLatest('DRAWING_TOOL/SET_CUSTOM_GEOJSON_FEATURES', flyToCurrentLocation);
  yield takeLatest('APP/MOBILE', flyToCurrentLocation);
  yield takeLatest('APP/SET_PRINTING_MODE', setPrintingProcess);
}
