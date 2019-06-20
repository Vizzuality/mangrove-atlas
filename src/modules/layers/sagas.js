import { takeLatest, put, call } from 'redux-saga/effects';
import DatasetService from 'services/dataset-service';
import { fetchRequested, fetchSucceeded, fetchFailed, toggleActive } from './actions';

const service = new DatasetService({ entityName: 'layers' });

export function* toggleActiveLayer({ payload }) {
  yield put(toggleActive({ id: payload.layerId, isActive: payload.isActive }));
}

function* getLayers() {
  yield put(fetchRequested());
  try {
    const layers = yield call(service.fetch, []);
    yield put(fetchSucceeded(layers));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* layersSagas() {
  yield takeLatest('WIDGET/TOGGLE_ACTIVE', toggleActiveLayer);
  yield takeLatest('LAYERS/FETCH_ALL', getLayers);
}
