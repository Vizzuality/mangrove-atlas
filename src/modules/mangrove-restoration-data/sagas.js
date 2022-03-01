import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveRestorationData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveRestorationData = yield call(service.fetchMangroveRestorationData, payload);
    yield put(fetchSucceeded(mangroveRestorationData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveRestorationDataSagas() {
  yield takeLatest('MANGROVE_RESTORATION_DATA/FETCH_ALL', getMangroveRestorationData);
}
