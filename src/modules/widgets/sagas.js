import { takeLatest, put, call } from 'redux-saga/effects';
import DatasetService from 'services/dataset-service';
import { fetchRequested, fetchSucceeded, fetchFailed, toggleActiveByLayerId } from './actions';

const service = new DatasetService({ entityName: 'widgets' });

export function* toggleWidgetActive({ payload }) {
  yield put(toggleActiveByLayerId({ layerId: payload.id, isActive: payload.isActive }));
}

export function* getWidgets() {
  yield put(fetchRequested());
  try {
    const widgets = yield call(service.fetch, []);

    // adding temporal widget for demo
    widgets.unshift({
      id: 'highlighted-areas',
      slug: 'highlighted-areas',
      name: 'Highlighted Areas',
      contextualLayerIds: [],
      layerId: null
    });

    yield put(fetchSucceeded(widgets));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* widgetsSagas() {
  yield takeLatest('LAYERS/TOGGLE_ACTIVE', toggleWidgetActive);
  yield takeLatest('WIDGETS/FETCH_ALL', getWidgets);
}
