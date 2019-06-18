import { takeLatest, put, call } from 'redux-saga/effects';
import { fetchRequested, fetchSucceeded, fetchFailed } from 'modules/layers/actions';
import DatasetService from 'services/dataset-service';

const service = new DatasetService({ entityName: 'layers' });

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
  yield takeLatest('LAYERS/FETCH_ALL', getLayers);
}
