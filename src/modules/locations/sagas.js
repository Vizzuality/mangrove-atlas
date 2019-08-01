import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getLocations() {
  yield put(fetchRequested());
  try {
    const locations = yield call(service.fetchLocations);
    yield put(fetchSucceeded(locations));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* locationsSagas() {
  yield takeLatest('LOCATIONS/FETCH_ALL', getLocations);
}
