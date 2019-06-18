import { takeLatest, put, call } from 'redux-saga/effects';
import DatasetService from 'services/dataset-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new DatasetService({ entityName: 'locations' });

function* getLocations() {
  yield put(fetchRequested());
  try {
    const layers = yield call(service.fetch, []);
    yield put(fetchSucceeded(layers));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* locationsSagas() {
  yield takeLatest('LOCATIONS/FETCH_ALL', getLocations);
}
