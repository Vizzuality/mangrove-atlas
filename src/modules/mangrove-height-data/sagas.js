import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveHeightData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveHeightData = yield call(service.fetchMangroveHeightData, payload);
    yield put(fetchSucceeded(mangroveHeightData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveHeightDataSagas() {
  yield takeLatest('MANGROVE_HEIGHT_DATA/FETCH_ALL', getMangroveHeightData);
}
