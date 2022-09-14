import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveActivityData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveActivityData = yield call(service.fetchMangroveActivityData, payload);
    yield put(fetchSucceeded(mangroveActivityData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveActivitySagas() {
  yield takeLatest('MANGROVE_ACTIVITY_DATA/FETCH_ALL', getMangroveActivityData);
}
